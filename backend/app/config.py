import os


class Config:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://filemanager:filemanager@localhost:5432/filemanager",
    )
