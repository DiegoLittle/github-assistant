
import os
import time
from dotenv import load_dotenv
import requests
from pymongo import MongoClient, UpdateOne
load_dotenv()  # take environment variables from .env.


github_token = os.getenv("API_GITHUB_TOKEN")
def query_repositories(query="stars:%3E1&sort=stars"):
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer '+github_token,
        'X-GitHub-Api-Version': '2022-11-28',
    }
    response = requests.get('https://api.github.com/search/repositories?q='+query, headers=headers)
    if response.status_code != 200:
        print("Error: "+str(response.text))
        if str(response.text).find("You have exceeded a secondary rate limit") != -1:
            print("Rate limit exceeded")
            time.sleep(60)
            return query_repositories(query)
        return None
    repositories = response.json().get("items")
    return repositories

def main():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["github-assistant"]
    # Get the repository with the least stars
    min_stars = db.repos.find_one(sort=[("stargazers_count", 1)])
    print("Min stars: "+str(min_stars["stargazers_count"]))
    for i in range(1, 1000):
        repos = query_repositories("stars:<="+str(min_stars["stargazers_count"])+"&sort=stars&per_page=100&page="+str(i) )
        repos = repos if repos is not None else []
        if repos is None or len(repos) == 0:
            continue
        repos_stars = [repo["stargazers_count"] for repo in repos if repo is not None and "stargazers_count" in repo]
        least_stars = min(repos_stars)
        print("Page "+str(i)+" Least stars: "+str(least_stars))
        db.repos.bulk_write([UpdateOne({"id": repo["id"]}, {"$set": repo}, upsert=True) for repo in repos])
        print("Inserted page "+str(i))
        time.sleep(5)

if __name__ == "__main__":
    main()