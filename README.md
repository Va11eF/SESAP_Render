# Student Experience Story Archive Project (SESAP)

## What is the SESAP Project?
The SESAP Project aims to create a sustainable platform that can be used to maintain, analyze, and present data related to underserved and marginalized students' experiences in the EECS program.
Automatic analysis is done on interviews from these students with the findings used to highlight areas of improvement. 

## Core Features
The SESAP system’s main features are its interview archiving ability and automatic chart generation. Whitelisted users are allowed to submit new student interviews to the archive as is shown in the video below.

[Watch the video](https://youtu.be/-_LrM5NgOdU) <br/>

Once the interview is submitted, the transcript file is automatically analyzed and the findings are then sent to the chart generator and the charts on the visualization page are updated in real time.

## Previous site
The previous SESAP website also served as an archive and provided visualizations, but everything had to be manually embedded in the code. We also aimed to make the site design a little cleaner and specifically declutter the narratives page.

<img width="630" alt="image" src="https://github.com/user-attachments/assets/cebed398-db62-430d-8415-b44c07bbefb0" /> <br/>
Figure 1. Narratives page of the old site. <br/>

<img width="630" alt="image" src="https://github.com/user-attachments/assets/0287893e-c20a-435e-a579-190545017b58" /> <br/>
Figure 2. Narratives page of the new site. <br/>

<img width="630" alt="image" src="https://github.com/user-attachments/assets/07288bbe-6021-47aa-993b-7fb8ee9152f8" /> <br/>
Figure 3. Word cloud of previous site. <br/>

<img width="630" alt="image" src="https://github.com/user-attachments/assets/50f7a253-5048-4346-8eb0-5bb4b10688f8" /> <br/>
Figure 4. World cloud of new site. <br/>

<img width="630" alt="image" src="https://github.com/user-attachments/assets/7f8e8888-7391-4470-99c1-b658609b7ad5" /> <br/>
Figure 5. Bar chart of previous site. <br/>

<img width="630" alt="image" src="https://github.com/user-attachments/assets/034214af-bfc8-48aa-92ea-12ff75b37627" /> <br/>
Figure 6. Bar chart of new site. <br/>


## Technical Implementation
Key Technologies <br/>
Frontend: React.js, Google Sign-In <br/>
Backend: .NET, MySQL <br/>
Transcript Analysis: Python, LangChain, Chroma, OpenRouter API (Mistral LLM Model) <br/>
Visualizations: SciPy chart outputs <br/>
Database: MySQL database hosted through Aiven <br/>

## Architecture Overview
This project is split up into multiple components, each with its own functionality and purpose. For more in depth detail, refer SESAP Design Document.

#### React Frontend UI 
Serves the content of the website, where users can view the different visualizations, narratives (interviews), purpose, and Recommendations. If a whitelisted user (which is verified via Google Sign-in) tries to post an interview, it sends a request to the backend controller with all of the required parameters. The same logic is applied if one of these users tries to delete an interview as well. The visualizations are also automatically updated and displayed to reflect any changes.

#### Backend Controller
Acts as the routing capability of the project, and is connected to both the database as well as the Large Language Model. When a request for a new interview comes in, the controller will first verify that the user is whitelisted, store all of the requested parameters in a database, convert the transcript text into a .docx file, and run the LLM script. When deleting an interview, the controller will look for that interviews ID in the database, locate it, and remove it. 
For API documentation, refer to SESAP API Document.

#### Transcript Analysis Pipeline
Runs in the background after each newly uploaded transcript, and outputs visualizations of the analyses generated. Once automatically initiated by the controller, it loads new transcripts into a vectorized database, which lets us use Retrieval Augmented Generation (RAG) when querying the LLM model. Using the OpenRouter API to query, the response is given in a JSON format, then loaded into MATLAB configuration, where it creates a bar chart and a word cloud of the analysis. 

## Access and Usage
General users can visit the website to view the student interviews or look over the visualizations. If you are a whitelisted user working with the project, then you are allowed to submit new interviews to the archive. As it's a website, no download is needed. Admins have access to whitelist new users.

Here is the link to the SESAP website: https://sesap-render.onrender.com/ 

## Deployment and Setup Procedures
For step-by-step guide on the deployment process, maintenance, and troubleshooting, refer to SESAP-Deployment-Hosting-Documentation.


## Contact Information
If you have any questions, or want to provide feedback to the project, do not hesitate to reach out!

#### Project Manager:
Rachael Cate (rachael.cate@oregonstate.edu)

#### Team Members:

Daniel Morden - Transcript Analysis Developer (mordend@oregonstate.edu)

Leon Ong - Frontend developer (ongl@oregonstate.edu)

Neal Ornes - Microcontroller Developer (ornesn@oregonstate.edu)

Fernando Valle - Database designer (vallefe@oregonstate.edu) 
