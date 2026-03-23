from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Transaction
from app.schemas.schemas import TransactionCreate, TransactionResponse
from app.services.fraud_detection import detect_fraud
from app.services.sentiment import analyze_sentiment
from typing import List

router = APIRouter()

@router.post("/transactions", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    is_fraud = detect_fraud(transaction.amount)
    sentiment = analyze_sentiment(str(transaction.amount))
    
    db_transaction = Transaction(
        amount=transaction.amount,
        user_id=transaction.user_id,
        is_fraud=is_fraud,
        sentiment=sentiment
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()