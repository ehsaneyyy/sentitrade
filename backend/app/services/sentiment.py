POSITIVE_KEYWORDS = [
    "profit", "growth", "surge", "gain", "rise", "bull", "up",
    "positive", "strong", "record", "high", "win", "success", "boom"
]

NEGATIVE_KEYWORDS = [
    "loss", "crash", "fall", "drop", "bear", "down", "negative",
    "weak", "fraud", "scam", "bankrupt", "risk", "decline", "warn"
]

def analyze_sentiment(headline: str) -> str:
    headline_lower = headline.lower()

    for word in POSITIVE_KEYWORDS:
        if word in headline_lower:
            return "positive"

    for word in NEGATIVE_KEYWORDS:
        if word in headline_lower:
            return "negative"

    return "neutral"