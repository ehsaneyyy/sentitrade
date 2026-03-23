from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import transactions, news
from app.db.database import engine
from app.models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentitrade API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(news.router)

@app.get("/")
def root():
    return {"message": "Sentitrade API is running"}