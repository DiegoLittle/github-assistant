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

def query_repositories(query="stars:%3E1&sort=stars"):
    repos_data_path = os.path.dirname(os.path.abspath(__file__)) + "/github_repos.json"
    if os.path.exists(repos_data_path):
        return get_data()
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+github_token,
        'X-GitHub-Api-Version': '2022-11-28',
    }
    response = requests.get('https://api.github.com/search/repositories?q='+query, headers=headers)
    repositories = response.json().get("items")
    return repositories

def get_data():
    p = Path(__file__).with_name("github_repos.json")
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def query_repo(repo):
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+github_token,
        'X-GitHub-Api-Version': '2022-11-28',
    }
    response = requests.get('https://api.github.com/repos/'+repo, headers=headers)
    return response.json()

def clean_repo_metadata(repo):
    for key in list(repo.keys()):
        if repo.get(key) is None:
            del repo[key]
        if repo.get(key) and type(repo[key]) == dict:
            print('key',key)
            del repo[key]
        if repo.get(key) and type(repo[key]) == list:
            print('key',key)
            del repo[key]
        if repo.get(key) is not None and (repo.get(key) == {} or repo.get(key) == [] or repo.get(key) == None):
            del repo[key]
    # print('repo',repo)
    return repo
    
def add_to_index(repo_path):
    client = chromadb.PersistentClient(path=embeddings_path)
    try:
        collection = client.get_collection(name="github_repos")
    except:
        make_embeddings()
        collection = client.get_collection(name="github_repos")
    existing_document = collection.get(str(repo_path))
    if len(existing_document.get('ids')) > 0:
        print("Document already exists in the index")
        return

    repo = query_repo(repo_path)
    repo = clean_repo_metadata(repo)


    collection.add(
        documents=[repo.get('description')],
        metadatas=[repo],
        ids=[str(repo.get("full_name"))],
    )


def get_predictions(owner,name):
    
    client = chromadb.PersistentClient(path=embeddings_path)
    try:
        collection = client.get_collection(name="github_repos")
    except:
        make_embeddings()
        collection = client.get_collection(name="github_repos")
    description = query_repo(owner+"/"+name).get('description')
    print(description)
    results = collection.query(
        query_texts=[description],
        n_results=3,
    )
    add_to_index(owner+"/"+name)
    return results


def make_embeddings(pages=15):
    print("Making embeddings")
    indexed_pages = []
    existing_data = []
    if os.path.exists("github_repos.json"):
        with open("github_repos.json", "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    data = existing_data
    # List of all unique pages in the data
    for elem in existing_data:
        if elem.get("page") is not None and elem.get("page") not in indexed_pages:
            indexed_pages.append(elem.get("page"))
    if len(indexed_pages) == pages:
        print("All pages are already indexed")
        return
    with open("github_repos.json", "w", encoding="utf-8") as f:
        json.dump(data, f)
    for i in range(pages):
        print("Fetching page", i+1)
        if i+1 in indexed_pages:
            continue
        start_fetch = time.time()
        repos = query_repositories("stars:%3E1&sort=stars&page="+str(i+1))
        # Add page to each repo

        # Add the new data to the file without overwriting the previous data to be efficient
        print("Finished fetching in --- %s seconds ---" % str(time.time() - start_fetch))
        if repos is None:
            continue
        for repo in repos:
            repo["page"] = i+2
        data = data + repos
        # Add the new data to the file without overwriting the previous data to be efficient
        def write_to_file(data):
            start_write = time.time()
            with open("github_repos.json", "r+", encoding="utf-8") as f:
                f.seek(0, 2)
                # JSON is a single array, so we need to remove the last character and add a comma
                f.seek(f.tell() - 1)
                f.write(',')
                # Remove the brackets from the data
                data_str = json.dumps(data)[1:-1]
                f.write(data_str)
                f.write(']')
            print("Finished writing in --- %s seconds ---" % str(time.time() - start_write))
        write_to_file(repos)

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
    data = [x for x in data if len(collection.get(str(x.get('full_name'))).get('ids')) == 0]
    if len(data) == 0:
        return
    data = [clean_repo_metadata(x) for x in data]
    metadatas = data
    collection.add(
        documents=texts,
        metadatas=metadatas,
        ids=[str(i.get("full_name")) for i in data],
    )

    print("Names of the repositories added to the index:", [x.get("full_name") for x in data] )





if __name__ == "__main__":
    start_time = time.time()
    # with open("github_repos.json", "r", encoding="utf-8") as f:
    #     json.dump(repositories, f, ensure_ascii=False, indent=4)
    make_embeddings(10)
    print("Finished in --- %s seconds ---" % int(time.time() - start_time))

