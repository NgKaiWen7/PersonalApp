from config import Config
from model.model import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(Config.DATABASE_URL, echo=True)


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
