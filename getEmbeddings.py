from langchain_huggingface import HuggingFaceEmbeddings


def getEmbeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2")
    return embeddings