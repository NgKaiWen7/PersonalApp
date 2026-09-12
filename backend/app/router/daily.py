import uuid
from datetime import date

from database import SessionLocal
from flask import Blueprint, request
from repo.daily_repo import DailyRepo

files_bp = Blueprint("files", __name__)


@files_bp.get("/today")
def get_today():
    with SessionLocal() as session:
        repo = DailyRepo(session)

        daily = repo.get_today()

        if daily is None:
            return {"message": "No TODO found for today"}, 404

        return {
            "id": str(daily.id),
            "date": daily.date.isoformat(),
            "tasks": [
                {
                    "id": str(task.id),
                    "task": task.task,
                    "comments": task.comments,
                    "is_finished": task.is_finished,
                }
                for task in daily.tasks
            ],
        }


@files_bp.post("/day")
def create_day():
    data = request.get_json()

    if not data or "date" not in data:
        return {
            "error": "date is required",
        }, 400

    try:
        todo_date = date.fromisoformat(data["date"])
    except ValueError:
        return {
            "error": "date must be in YYYY-MM-DD format",
        }, 400

    with SessionLocal() as session:
        repo = DailyRepo(session)

        daily = repo.create_day(todo_date)

        return {
            "id": str(daily.id),
            "date": daily.date.isoformat(),
        }, 201


@files_bp.delete("/task/<uuid:task_id>")
def delete_task(task_id: uuid.UUID):
    with SessionLocal() as session:
        repo = DailyRepo(session)

        deleted = repo.delete_task(task_id)

        if not deleted:
            return {
                "error": "Task not found",
            }, 404

        return {
            "message": "Task deleted",
            "id": str(task_id),
        }


@files_bp.delete("/day/<uuid:daily_todo_id>")
def delete_day(daily_todo_id: uuid.UUID):
    with SessionLocal() as session:
        repo = DailyRepo(session)

        deleted = repo.delete_day(daily_todo_id)

        if not deleted:
            return {
                "error": "TODO day not found",
            }, 404

        return {
            "message": "TODO day deleted",
            "id": str(daily_todo_id),
        }


@files_bp.patch("/task/<uuid:task_id>")
def update_task(task_id: uuid.UUID):
    data = request.get_json()

    if not data:
        return {
            "error": "JSON body is required",
        }, 400

    is_finished = data.get("is_finished")
    comments = data.get("comments")

    if is_finished is None and comments is None:
        return {
            "error": "is_finished or comments is required",
        }, 400

    if is_finished is not None and not isinstance(is_finished, bool):
        return {
            "error": "is_finished must be a boolean",
        }, 400

    with SessionLocal() as session:
        repo = DailyRepo(session)

        task = repo.update_task(
            task_id=task_id,
            is_finished=is_finished,
            comments=comments,
        )

        if task is None:
            return {
                "error": "Task not found",
            }, 404

        return {
            "id": str(task.id),
            "task": task.task,
            "comments": task.comments,
            "is_finished": task.is_finished,
        }
