# reference: 
# https://github.com/pixegami/langchain-rag-tutorial
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from getEmbeddings import getEmbeddings
from langchain_chroma import Chroma
import shutil

DATA_PATH = "./transcripts/" 
CHROMA_PATH = "chroma"

# if not os.path.exists(DATA_PATH):
#     print(f"Directory {DATA_PATH} does not exist.")

def main():
    try:
        documents = loadDocuments()
        chunks = splitDocuments(documents)
        addToChroma(chunks)
        # if documents:
        #     print(documents[0])
        # else:
        #     print("No documents loaded.")
    except Exception as e:
        print(f"An error occurred: {e}")


def loadDocuments():
    loader = DirectoryLoader(DATA_PATH, glob="**/*.docx")
    documents = loader.load()
    return documents

def splitDocuments(documents: list[Document]):
    textSplitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return textSplitter.split_documents(documents)

def addToChroma(chunks: list[Document]):
    #load existing database
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=getEmbeddings()
    )

    chunkIDs = calculateChunkID(chunks)

    # add/update the documents
    existingItems = db.get(include=[])
    existingIds = set(existingItems["ids"])
    print(f"Number of existing documents in DB: {len(existingIds)}")

    #only add documents that don't exist in the DB
    newChunks = []
    for chunk in chunkIDs:
        if chunk.metadata["id"] not in existingIds:
            newChunks.append(chunk)

    if len(newChunks):
        print(f"Adding new documents: {len(newChunks)}")
        newChunkID = [chunk.metadata["id"] for chunk in newChunks]
        db.add_documents(newChunks, ids=newChunkID)
    else:
        print("No new documents to add")


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
        shutil.rmtree(CHROMA_PATH)

if __name__ == "__main__":
    main()