# reference: 
# https://github.com/pixegami/langchain-rag-tutorial
print("[PYTHON] populateDatabase.py started", flush=True)
import os
import time
import shutil
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from getEmbeddings import getEmbeddings
from langchain_chroma import Chroma

DATA_PATH = "./transcripts/"
CHROMA_PATH = "chroma"

def main():
    try:
        print("[INFO] Script started.", flush=True)
        print(f"[INFO] Working directory: {os.getcwd()}", flush=True)

        if not os.path.exists(DATA_PATH):
            print(f"[ERROR] transcripts folder not found at {DATA_PATH}", flush=True)
            return
        else:
            print(f"[INFO] transcripts directory found at: {DATA_PATH}", flush=True)

        documents = loadDocuments()
        print(f"[INFO] Loaded {len(documents)} documents.", flush=True)

        if not documents:
            print("[WARN] No documents found in transcripts folder.", flush=True)
            return

        chunks = splitDocuments(documents)
        print(f"[INFO] Split documents into {len(chunks)} chunks.", flush=True)

        #addToChroma(chunks)

        print("[INFO] Script completed successfully.", flush=True)

    except Exception as e:
        print(f"[EXCEPTION] An error occurred: {e}", flush=True)

def loadDocuments():
    loader = DirectoryLoader(DATA_PATH, glob="**/*.docx")
    documents = loader.load()
    return documents


# def loadDocuments():
#     print("[INFO] Attempting to load documents from:", DATA_PATH, flush=True)
    
#     if not os.path.exists(DATA_PATH):
#         print("[ERROR] transcripts directory not found!", flush=True)
#         return []

#     files = list(os.walk(DATA_PATH))
#     print(f"[INFO] Found {len(files)} file/folder entries under transcripts/", flush=True)

#     for dirpath, _, filenames in files:
#         for f in filenames:
#             print(f"[DEBUG] Found file: {os.path.join(dirpath, f)}", flush=True)

#     try:
#         loader = DirectoryLoader(DATA_PATH, glob="**/*.docx")
#         documents = loader.load()
#         print(f"[INFO] Successfully loaded {len(documents)} documents", flush=True)
#         return documents
#     except Exception as e:
#         print(f"[EXCEPTION] During DirectoryLoader.load(): {e}", flush=True)
#         return []



def splitDocuments(documents: list[Document]):
    textSplitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return textSplitter.split_documents(documents)

# def addToChroma(chunks: list[Document]):
#    #load existing database
#     db = Chroma(
#         persist_directory=CHROMA_PATH,
#         embedding_function=getEmbeddings()
#     )

#     chunkIDs = calculateChunkID(chunks)
#     # add/update the documents
#     existingItems = db.get(include=[])
#     existingIds = set(existingItems["ids"])

#     print(f"[INFO] Existing documents in DB: {len(existingIds)}", flush=True)

#     #only add documents that don't exist in the DB
#     newChunks = []
#     for chunk in chunkIDs:
#         if chunk.metadata["id"] not in existingIds:
#             newChunks.append(chunk)

#     if newChunks:
#         print(f"[INFO] Adding {len(newChunks)} new documents to Chroma.", flush=True)
#         newChunkID = [chunk.metadata["id"] for chunk in newChunks]
#         db.add_documents(newChunks, ids=newChunkID)
#     else:
#         print("[INFO] No new documents to add.", flush=True)

def addToChroma(chunks: list[Document]):
    print("[DEBUG] addToChroma entered", flush=True)

    # Comment out everything except the embedding init
    try:
        print("[DEBUG] Initializing embeddings...", flush=True)
        embeddings = getEmbeddings()
        print("[DEBUG] Embeddings initialized successfully.", flush=True)
    except Exception as e:
        print(f"[EXCEPTION] Failed to initialize embeddings: {e}", flush=True)

def calculateChunkID(chunks):
    #this will create IDs like "transcripts/...docx:3:5"
    # Document Source : Page Number : Chunk Index
    lastPageID = None
    currentChunkIdx = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        currentPageID = f"{source}:{page}"

        #if page ID is same as the last one, increment index
        if currentPageID == lastPageID:
            currentChunkIdx += 1
        else:
            currentChunkIdx = 0

         # calculate the chunk ID
        chunk_id = f"{currentPageID}:{currentChunkIdx}"
        lastPageID = currentPageID

        # add it to the page meta-data
        chunk.metadata["id"] = chunk_id

    return chunks

def clear_database():
    if os.path.exists(CHROMA_PATH):
        print(f"[INFO] Clearing Chroma database at {CHROMA_PATH}", flush=True)
        shutil.rmtree(CHROMA_PATH)

if __name__ == "__main__":
    print("[PYTHON] populateDatabase.py main entered", flush=True)
    main()
