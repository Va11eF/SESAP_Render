import json
import re
import os
from dotenv import load_dotenv
from queryLLM import query_rag

RESULTS_PATH = "./results/"
RESULTS_FILE = os.path.join(RESULTS_PATH, " .json")  

def main():
    load_dotenv()
    transcriptFileNames = [ 
        f for f in os.listdir("./transcripts/") 
        if f.endswith(".docx")
    ]
    queryAll(transcriptFileNames)

def saveResults(filename, results):
    if not os.path.exists(RESULTS_PATH):
        os.makedirs(RESULTS_PATH)

    resultsFile = os.path.join(RESULTS_PATH, f"{filename}_results.json")
    
    with open(resultsFile, "w") as file:
        json.dump(results, file, indent=4)


def formatJSON(responseLLM):
    stack = []
    start = None
    for i, char in enumerate(responseLLM):
        if char == '{':
            if not stack:
                start = i
            stack.append(char)
        elif char == '}':
            if stack:
                stack.pop()
                if not stack and start is not None:
                    json_candidate = responseLLM[start:i+1]
                    try:
                        return json.loads(json_candidate)
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON")
                        return None

def queryAll(transcriptFileNames):
    for filename in transcriptFileNames:
        resultsFile = os.path.join(RESULTS_PATH, f"{filename}_results.json")
        
        if os.path.exists(resultsFile):
            print(f"Skipping {filename} [results already exist.]")
            continue

        print(f"Processing: {filename}")
        responseLLM = query_rag(filename) 
        
        formattedResponse = formatJSON(responseLLM)
        saveResults(filename, formattedResponse)

if __name__ == "__main__":
    main()
