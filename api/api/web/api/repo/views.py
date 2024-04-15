import os
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.param_functions import Depends

from .schema import RepoModeInputDTO

from .embeddings.create_embeddings import get_predictions
from .embeddings.create_embeddings import query_repositories

from api.db.dao.dummy_dao import DummyDAO
from api.db.models.dummy_model import DummyModel
from api.web.api.dummy.schema import DummyModelDTO, DummyModelInputDTO
router = APIRouter()


@router.get("/", response_model=List[DummyModelDTO])
async def get_dummy_models(
    limit: int = 10,
    offset: int = 0,
    dummy_dao: DummyDAO = Depends(),
) -> List[DummyModel]:
    """
    Retrieve all dummy objects from the database.

    :param limit: limit of dummy objects, defaults to 10.
    :param offset: offset of dummy objects, defaults to 0.
    :param dummy_dao: DAO for dummy models.
    :return: list of dummy objects from database.
    """
    return await dummy_dao.get_all_dummies(limit=limit, offset=offset)


@router.post("/similar")
async def similarity_route(repo:RepoModeInputDTO) -> None:
    """
    Find similar Github repositories based on the description.

    :param description: description of the repository.
    """
    preds = get_predictions(
       repo.owner,repo.name)
    if preds is None:
            raise HTTPException(status_code=404, detail="No similar repositories found")
    return preds.get('metadatas')[0]
