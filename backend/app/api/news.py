from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import News
from app.schemas.schemas import NewsCreate, NewsResponse
from app.services.sentiment import analyze_sentiment
from typing import List

router = APIRouter()

@router.post("/news", response_model=NewsResponse)
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    sentiment = analyze_sentiment(news.headline)
    
    db_news = News(
        headline=news.headline,
        sentiment=sentiment
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@router.get("/news", response_model=List[NewsResponse])
def get_news(db: Session = Depends(get_db)):
    return db.query(News).all()