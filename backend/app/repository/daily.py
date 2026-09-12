import uuid
from datetime import date

from model.model import DailyTODO, TaskToDo
from sqlalchemy import select
from sqlalchemy.orm import Session


class DailyRepo:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_today(self) -> DailyTODO | None:
        """Get today's TODO list."""
        today = date.today()

        stmt = select(DailyTODO).where(DailyTODO.date == today)

        return self.session.scalar(stmt)

    def create_day(self, todo_date: date) -> DailyTODO:
        """Create a TODO day."""
        daily_todo = DailyTODO(date=todo_date)
        self.session.add(daily_todo)
        self.session.commit()
        self.session.refresh(daily_todo)
        return daily_todo

    def delete_task(self, task_id: uuid.UUID) -> bool:
        """Delete a task by UUID."""
        task = self.session.get(TaskToDo, task_id)
        if task is None:
            return False
        self.session.delete(task)
        self.session.commit()
        return True

    def delete_day(self, daily_todo_id: uuid.UUID) -> bool:
        """Delete an entire TODO day by UUID."""
        daily_todo = self.session.get(DailyTODO, daily_todo_id)
        if daily_todo is None:
            return False
        self.session.delete(daily_todo)
        self.session.commit()
        return True

    def update_task(
        self,
        task_id: uuid.UUID,
        is_finished: bool | None = None,
        comments: str | None = None,
    ) -> TaskToDo | None:
        """Update task status and/or comments."""
        task = self.session.get(TaskToDo, task_id)

        if task is None:
            return None

        if is_finished is not None:
            task.is_finished = is_finished

        if comments is not None:
            task.comments = comments

        self.session.commit()
        self.session.refresh(task)
        return task
