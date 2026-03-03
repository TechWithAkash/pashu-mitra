from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field


class PredictionRecord(BaseModel):
    user_id: Optional[str] = None
    image_filename: str
    prediction_result: str
    confidence: float
    probabilities: dict
    quality_warning: Optional[str] = None
    advice: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PredictionHistoryResponse(BaseModel):
    id: str
    image_filename: str
    prediction_result: str
    confidence: float
    probabilities: dict
    quality_warning: Optional[str] = None
    advice: str
    created_at: datetime
