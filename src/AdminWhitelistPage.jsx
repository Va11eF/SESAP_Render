import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: auto;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 8px;
  }

  button {
    padding: 8px 12px;
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const EmailList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    background: #f1f3f5;
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;

    button {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
    }
  }
`;

export default function AdminWhitelistPage() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const fetchEmails = async () => {
    try {
      const res = await axios.get("/api/whitelist");
      setEmails(res.data.map(e => e.email));
    } catch (err) {
      console.error("Error fetching whitelist:", err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("/api/whitelist", { email: newEmail });
      setNewEmail("");
      fetchEmails();
    } catch (err) {
      console.error("Failed to add email:", err);
    }
  };

//   const handleDelete = async (emailToRemove) => {
//     try {
//       await axios.delete(`/api/whitelist/${encodeURIComponent(emailToRemove)}`);
//       fetchEmails();
//     } catch (err) {
//       console.error("Failed to delete email:", err);
//     }
//   };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <Wrapper>
      <h2>Manage Whitelist</h2>
      <InputGroup>
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </InputGroup>
      <EmailList>
        {emails.map((email) => (
          <li key={email}>
            {email}
            {/* <button onClick={() => handleDelete(email)}>Remove</button> */}
          </li>
        ))}
      </EmailList>
    </Wrapper>
  );
}
