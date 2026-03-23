FRAUD_AMOUNT_THRESHOLD = 10000

def detect_fraud(amount: float) -> bool:
    return amount > FRAUD_AMOUNT_THRESHOLD