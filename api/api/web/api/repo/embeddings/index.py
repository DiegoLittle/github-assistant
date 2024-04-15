

import json
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()




if __name__ == '__main__':
    with open("../../../../../github_repos.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    print(len(data))
    conn = psycopg2.connect(
            dbname=os.getenv("db_base"),
            user=os.getenv("db_user"),
            password=os.getenv("db_pass"),
            host=os.getenv("db_host"),
        )
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
    # Create the table
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS repo (
            id INT PRIMARY KEY,
            node_id TEXT,
            name TEXT,
            full_name TEXT,
            private BOOLEAN,
            html_url TEXT,
            description TEXT,
            fork BOOLEAN,
            url TEXT,
            forks_url TEXT,
            keys_url TEXT,
            collaborators_url TEXT,
            teams_url TEXT,
            hooks_url TEXT,
            issue_events_url TEXT,
            events_url TEXT,
            assignees_url TEXT,
            branches_url TEXT,
            tags_url TEXT,
            blobs_url TEXT,
            git_tags_url TEXT,
            git_refs_url TEXT,
            trees_url TEXT,
            statuses_url TEXT,
            languages_url TEXT,
            stargazers_url TEXT,
            contributors_url TEXT,
            subscribers_url TEXT,
            subscription_url TEXT,
            commits_url TEXT,
            git_commits_url TEXT,
            comments_url TEXT,
            issue_comment_url TEXT,
            contents_url TEXT,
            compare_url TEXT,
            merges_url TEXT,
            archive_url TEXT,
            downloads_url TEXT,
            issues_url TEXT,
            pulls_url TEXT,
            milestones_url TEXT,
            notifications_url TEXT,
            labels_url TEXT,
            releases_url TEXT,
            deployments_url TEXT
        )
        """
    )
    def generate_create_table_query(table_name, data):
        columns = ', '.join(['{} VARCHAR'.format(key) for key in data.keys()])
        query = "CREATE TABLE IF NOT EXISTS {} ({})".format(table_name, columns)
        return query
    for repo in data:
        cur = conn.cursor()
        repo = clean_repo_metadata(repo)

        def generate_insert_query(table_name, data):
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['%({})s'.format(key) for key in data.keys()])
            query = "INSERT INTO {} ({}) VALUES ({})".format(table_name, columns, placeholders)
            return query

        cur.execute(
            """
            INSERT INTO repo (
                id, node_id, name, full_name, private, html_url, description,
                fork, url, forks_url, keys_url, collaborators_url, teams_url,
                hooks_url, issue_events_url, events_url, assignees_url, branches_url,
                tags_url, blobs_url, git_tags_url, git_refs_url, trees_url,
                statuses_url, languages_url, stargazers_url, contributors_url,
                subscribers_url, subscription_url, commits_url, git_commits_url,
                comments_url, issue_comment_url, contents_url, compare_url,
                merges_url, archive_url, downloads_url, issues_url, pulls_url,
                milestones_url, notifications_url, labels_url, releases_url,
                deployments_url
            ) VALUES (
                %(id)s, %(node_id)s, %(name)s, %(full_name)s, %(private)s, %(html_url)s,
                %(description)s, %(fork)s, %(url)s, %(forks_url)s, %(keys_url)s,
                %(collaborators_url)s, %(teams_url)s, %(hooks_url)s, %(issue_events_url)s,
                %(events_url)s, %(assignees_url)s, %(branches_url)s, %(tags_url)s,
                %(blobs_url)s, %(git_tags_url)s, %(git_refs_url)s, %(trees_url)s,
                %(statuses_url)s, %(languages_url)s, %(stargazers_url)s, %(contributors_url)s,
                %(subscribers_url)s, %(subscription_url)s, %(commits_url)s, %(git_commits_url)s,
                %(comments_url)s, %(issue_comment_url)s, %(contents_url)s, %(compare_url)s,
                %(merges_url)s, %(archive_url)s, %(downloads_url)s, %(issues_url)s,
                %(pulls_url)s, %(milestones_url)s, %(notifications_url)s, %(labels_url)s,
                %(releases_url)s, %(deployments_url)s
            ) ON CONFLICT (id) DO NOTHING
            """,
            repo  # Assuming repo is a dictionary containing the cleaned repository metadata
        )
        conn.commit()
        cur.close()
    conn.close()

        
        