const fs = require("fs");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const app = express();

const { spawn } = require('child_process');

// Ensure the "uploads" directory exists
const uploadsDir = path.join(__dirname, "transcripts");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to save files to the "uploads" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

function runScript(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("python3", [script]);

    child.stdout.on("data", data => {
      console.log(`[${script}] Output:`, data.toString());
    });

    child.stderr.on("data", data => {
      console.error(`[${script}] Error:`, data.toString());
    });

    child.on("close", code => {
      console.log(`[${script}] exited with code ${code}`);
      resolve();  // Resolve when done (even if code != 0)
    });

    child.on("error", err => {
      console.error(`[${script}] Failed to start:`, err);
      reject(err); // Reject on spawn error
    });
  });
}

// Increase the payload size limit for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware setup
app.use(cors({ origin: "*" }));
app.use(express.json());

const BACKEND_URL = process.env.BACKEND_URL || "http://0.0.0.0:5084";

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(uploadsDir));

// Fetch all narratives from the external API
app.get("/api/narratives", async (req, res) => {
  try {
    // Fetch narratives from the external API
    const response = await axios.get(`${BACKEND_URL}/api/v1/interviews`);
    const externalNarratives = response.data;  // Assuming the API returns an array of narratives
    res.json(externalNarratives);
  } catch (error) {
    console.error("Error fetching narratives:", error);
    res.status(500).json({ error: "Failed to fetch narratives" });
  }
});

// Fetch a specific narrative by ID from the external API
app.get("/api/narratives/:id", async (req, res) => {
  const narrativeId = parseInt(req.params.id);
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/interviews/${narrativeId}`);
    const narrative = response.data; // Assuming the API returns a single narrative by ID
    if (narrative) {
      res.json(narrative);
    } else {
      res.status(404).json({ error: "Narrative not found" });
    }
  } catch (error) {
    console.error(`Error fetching narrative with ID ${narrativeId}:`, error);
    res.status(500).json({ error: "Failed to fetch narrative" });
  }
});

// `transcript` is the field name in the form data for the uploaded file
app.post("/proxy/api/narratives", upload.single("transcript"), async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("Uploaded file info:", req.file);

      // If file uploaded, get path and read if needed
      let transcriptText = "";
      if (req.file) {
        const filePath = req.file.path;
      }

      const newNarrative = {
        intervieweeName: req.body.intervieweeName,
        interviewerName: req.body.interviewerName,
        interviewDate: req.body.interviewDate,
        interviewDesc: req.body.interviewDesc,
        interviewEmbedLink: req.body.interviewEmbedLink,
        interviewTranscript: transcriptText,
      };

      // Example: if your backend needs the file path or filename, add it:
      if (req.file) {
        newNarrative.transcriptFilename = req.file.filename; // or req.file.path
      }

      // Send data to external API
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/interviews`,
        newNarrative
      );


      //await runScript("populateDatabase.py");
      await runScript("queryAll.py");
      await runScript("generateCharts.py");


      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error saving narrative:", error);
      res.status(500).json({ error: "Failed to save narrative" });
    }
  }
);

app.put("/api/narratives/:id/embed", async (req, res) => {
  const narrativeId = parseInt(req.params.id);
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/interviews/${narrativeId}`);
    let narrative = response.data; // Assuming the API returns a single narrative by ID

    if (!narrative) {
      return res.status(404).json({ error: "Narrative not found" });
    }

    let embedLinks = [];

    if (req.body.embedLinks) {
      try {
        embedLinks = Array.isArray(req.body.embedLinks)
          ? req.body.embedLinks
          : JSON.parse(req.body.embedLinks);
      } catch (err) {
        console.warn("Failed to parse embedLinks, falling back to single string");
        embedLinks = [req.body.embedLinks];
      }
    }

    narrative.embedLinks = embedLinks;

    // Save the updated narrative in your actual database or external API if needed

    res.status(200).json({ message: "Embed links updated", narrative });
  } catch (error) {
    console.error(`Error updating embed links for narrative ID ${narrativeId}:`, error);
    res.status(500).json({ error: "Failed to update embed links" });
  }
});


// Fetch all whitelisted users from the external API
app.get("/api/whitelist", async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/whitelistedUsers`);
    const whitelistUsers = response.data;  
    res.json(whitelistUsers);
  } catch (error) {
    console.error("Error fetching whitelisted users:", error);
    res.status(500).json({ error: "Failed to fetch whitelisted users" });
  }
});

app.post("/api/whitelist", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/whitelistedUsers`, { email });
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error adding whitelisted user:", error);
    res.status(500).json({ error: "Failed to add whitelisted user" });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;

// Serve static files from the Vite dist directory
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});