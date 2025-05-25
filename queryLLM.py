import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
import requests
from dotenv import load_dotenv
import os
from getEmbeddings import getEmbeddings
from collections import defaultdict

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Analyze the following student interview transcript and extract key themes and topics:

{context}

---

Identify all relevant themes or topics that the student discusses. Only use the themes from the following list:

    Academic Difficulty

    Faculty Support

    Peer Relationships

    Belonging

    Cultural Representation

    Financial Struggles

    Mental Health

    Family Pressure

    Work-Life Balance

    Identity & Discrimination

    Career Preparation

    Language Barriers

    Support Networks

    Personal Growth

Also list the identities that the student identifies with based on the transcript. Only use the identities from the following list:

First-Generation Student

LGBTQ+

Immigrant

Veteran

Parent

Low-Income

Student of Color

Transfer Student

Non-Traditional Age

Religious

Disabled

International Student

Rural

Working Student

STEM Minoritized

Then return the following structured JSON:

{{
  "name": "Student Full Name",
  "themes": "Most significant theme", "Possible Second theme",
  "identities": "Most significant identity", "Possible Second identity",
  "description": "Single sentence analysis of the student experience."
}}

Only return the JSON response with extracted data. Do not include any additional explanation or commentary.
"""


def main():
    configure()
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)

def configure():
    load_dotenv()

def openrouterEndpoint(prompt):
    # print(f"API Key: {os.getenv('apiKey')}")
    headers = {
        "Authorization": f"Bearer {os.getenv('apiKey')}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [{"role": "system", "content": "You are an AI assistant."},
                     {"role": "user", "content": prompt}],
        "max_tokens": 500,
        "temperature": 0.7
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error {response.status_code}: {response.text}"
    
def query_rag(transcriptFileName: str):
    print(f"Querying Chroma DB for transcript file: {transcriptFileName}...")
    embeddings = getEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)

    #get all chunks of matching transcript
    matchingChunks = db.get(include=["documents", "metadatas"])
    documents_list = matchingChunks["documents"]  # List of document texts
    metadatas_list = matchingChunks["metadatas"]
    fullTranscriptChunks = [
        documents_list[i]  # Get document text at index i
        for i, metadata in enumerate(metadatas_list)
        if metadata.get("source") and transcriptFileName in metadata.get("source")
    ]

    if not fullTranscriptChunks:
        print(f"No transcript retrieved for {transcriptFileName}.")
        return None

    #format transcript text into llm prompt context
    context_text = "\n\n---\n\n".join(fullTranscriptChunks)
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text)
    print(prompt)

    responseLLM = openrouterEndpoint(prompt)

    # sources = [doc.metadata.get("id", None) for doc, _score in results]
    # responseFormatted = f"Response: {responseLLM}\nSources: {sources}"
    # print(responseFormatted)
    print(responseLLM)
    return responseLLM


if __name__ == "__main__":
    main()