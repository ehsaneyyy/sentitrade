from pydantic import BaseModel
from datetime import datetime

class TransactionCreate(BaseModel):
    amount: float
    user_id: int

class TransactionResponse(BaseModel):
    id: int
    amount: float
    timestamp: datetime
    user_id: int
    is_fraud: bool
    sentiment: str

    model_config = {"from_attributes": True}

class NewsCreate(BaseModel):
    headline: str

class NewsResponse(BaseModel):
    id: int
    headline: str
    sentiment: str

    model_config = {"from_attributes": True}

class AlertResponse(BaseModel):
    id: int
    message: str
    type: str
    created_at: datetime

    model_config = {"from_attributes": True}
