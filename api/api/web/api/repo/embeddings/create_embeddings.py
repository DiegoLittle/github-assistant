import json
import time
from pathlib import Path
import requests
import os
from dotenv import load_dotenv
from chromadb.utils import embedding_functions
import chromadb


embeddings_path = os.path.dirname(os.path.abspath(__file__)) + "/embeddings_index"
chroma_client = chromadb.PersistentClient(path=embeddings_path)
load_dotenv()  # take environment variables from .env.


github_token = os.getenv("API_GITHUB_TOKEN")

def query_repositories():
    repos_data_path = os.path.dirname(os.path.abspath(__file__)) + "/github_repos.json"
    if os.path.exists(repos_data_path):
        return get_data()
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+github_token,
        'X-GitHub-Api-Version': '2022-11-28',
    }
    response = requests.get('https://api.github.com/repositories', headers=headers)
    repositories = response.json()
    with open("github_repos.json", "w", encoding="utf-8") as f:
        json.dump(repositories, f, ensure_ascii=False, indent=4)

    return repositories

def get_data():
    p = Path(__file__).with_name("github_repos.json")
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)



def get_predictions(description):
    client = chromadb.PersistentClient(path=embeddings_path)
    collection = client.get_collection(name="github_repos")
    results = collection.query(
        query_texts=[description],
        n_results=3,
    )
    return results


def make_embeddings():
    data = query_repositories()
    data = [elem for elem in data if elem["description"] is not None]
    texts = []
    for elem in data:
        current_text = elem["description"]
        texts.append(current_text)
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    try:
        collection = chroma_client.get_collection(name="github_repos", embedding_function=sentence_transformer_ef)
    except:
        collection = chroma_client.create_collection(name="github_repos", embedding_function=sentence_transformer_ef)
    data = [x for x in data if len(collection.get(str(x.get('id'))).get('ids')) == 0]
    if len(data) == 0:
        return
    for x in data:
        del x["owner"]
    metadatas = data
    collection.add(
        documents=texts,
        metadatas=metadatas,
        ids=[str(i.get("id")) for i in data],
    )





if __name__ == "__main__":
    start_time = time.time()
    make_embeddings()
    print("Finished in --- %s seconds ---" % int(time.time() - start_time))

