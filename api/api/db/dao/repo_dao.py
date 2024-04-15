from typing import List, Optional

from fastapi import Depends
from psycopg.rows import class_row
from psycopg_pool import AsyncConnectionPool

from api.db.dependencies import get_db_pool
from api.db.models.repo_model import RepoModel


class RepoDAO:
    """Class for accessing dummy table."""

    def __init__(
        self,
        db_pool: AsyncConnectionPool = Depends(get_db_pool),
    ):
        self.db_pool = db_pool

    async def create_repo_model(self, 
                                # Spread operator
                                **kwargs
                                ) -> None:
        """
        Creates new dummy in a database.

        :param name: name of a dummy.
        """
        async with self.db_pool.connection() as connection:
            async with connection.cursor(binary=True) as cur:
                await cur.execute(
                    "INSERT INTO repo (id,node_id,name,full_name,private,html_url,description,fork,url,forks_url,keys_url,collaborators_url,teams_url,hooks_url,issue_events_url,events_url,assignees_url,branches_url,tags_url,blobs_url,git_tags_url,git_refs_url,trees_url,statuses_url,languages_url,stargazers_url,contributors_url,subscribers_url,subscription_url) VALUES (%(name)s);",
                    params={
                        # Kwargs
                        **kwargs
                    },
                )

    async def get_all_dummies(self, limit: int, offset: int) -> List[RepoModel]:
        """
        Get all dummy models with limit/offset pagination.

        :param limit: limit of dummies.
        :param offset: offset of dummies.
        :return: stream of dummies.
        """
        async with self.db_pool.connection() as connection:
            async with connection.cursor(
                binary=True,
                row_factory=class_row(RepoModel),
            ) as cur:
                res = await cur.execute(
                    "SELECT id, name FROM repo LIMIT %(limit)s OFFSET %(offset)s;",
                    params={
                        "limit": limit,
                        "offset": offset,
                    },
                )
                return await res.fetchall()

    async def filter(
        self,
        name: Optional[str] = None,
    ) -> List[RepoModel]:
        """
        Get specific dummy model.

        :param name: name of dummy instance.
        :return: dummy models.
        """
        async with self.db_pool.connection() as connection:
            async with connection.cursor(
                binary=True,
                row_factory=class_row(RepoModel),
            ) as cur:
                if name is not None:
                    res = await cur.execute(
                        "SELECT id, name FROM repo WHERE name=%(name)s;",
                        params={
                            "name": name,
                        },
                    )
                else:
                    res = await cur.execute("SELECT id, name FROM dummy;")
                return await res.fetchall()
