import uuid
from datetime import datetime
from re import T

from sqlalchemy import UUID, Boolean, Date, DateTime, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import BigInteger


class Base(DeclarativeBase):
    pass


class Files(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    ispriority: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class DailyTODO(Base):
    __tablename__ = "daily_todo"
    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    date: Mapped[datetime] = mapped_column(Date, nullable=False)
    tasks: Mapped[list["TaskToDo"]] = relationship(
        back_populates="daily_todo", cascade="all, delete-orphan"
    )


class TaskToDo(Base):
    __tablename__ = "tasktodo"
    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    daily_todo_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("daily_todo.id"), nullable=False
    )
    task: Mapped[str] = mapped_column(String, nullable=False)
    comments: Mapped[str] = mapped_column(String, nullable=True)
    is_finished: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    daily_todo: Mapped["DailyTODO"] = relationship(back_populates="tasks")
