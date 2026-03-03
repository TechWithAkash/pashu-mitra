from contextlib import asynccontextmanager
from typing import Optional

from bson import ObjectId
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    File,
    HTTPException,
    Query,
    Response,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.auth.dependencies import get_current_user, get_optional_user, require_role
from src.auth.router import router as auth_router
from src.config import settings
from src.database import close_mongodb_connection, connect_to_mongodb, get_database
from src.logger import logger
from src.models.prediction import PredictionHistoryResponse, PredictionRecord
from src.models.user import UserRole
from src.pipelines.prediction_pipeline import PredictionPipeline
from src.pipelines.training_pipeline import TrainingPipeline
from src.utils import BASE_DIR, load_json

# ---------------------------------------------------------------------------
# Global State
# ---------------------------------------------------------------------------
prediction_pipeline: PredictionPipeline | None = None
training_pipeline = TrainingPipeline()


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    global prediction_pipeline

    # ---- Startup ----
    # Connect to MongoDB
    await connect_to_mongodb()

    # Create indexes
    db = get_database()
    await db.users.create_index("email", unique=True)
    await db.predictions.create_index("user_id")
    await db.predictions.create_index("created_at")
    await db.blacklisted_tokens.create_index("jti", unique=True)
    await db.blacklisted_tokens.create_index("exp", expireAfterSeconds=0)
    logger.info("MongoDB indexes created")

    # Load ML model
    try:
        prediction_pipeline = PredictionPipeline()
        if prediction_pipeline.model is not None:
            logger.info("Prediction pipeline loaded successfully at startup")
        else:
            logger.warning("No trained model found. Train first via POST /train")
    except Exception as e:
        logger.warning(f"Could not initialize prediction pipeline: {e}")
        prediction_pipeline = None

    yield

    # ---- Shutdown ----
    await close_mongodb_connection()


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Pashumitra - Lumpy Skin Disease Detection API",
    description="AI-powered early detection of Lumpy Skin Disease in cattle",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)


# ---------------------------------------------------------------------------
# Pydantic Response Models
# ---------------------------------------------------------------------------
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: dict
    quality_warning: str | None = None
    advice: str


class GradCAMResponse(PredictionResponse):
    gradcam_image: str  # base64-encoded PNG


class TrainingStatusResponse(BaseModel):
    status: str
    progress: str
    error: str | None = None
    metrics: dict | None = None
    elapsed_seconds: float | None = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


class ModelInfoResponse(BaseModel):
    architecture: str
    img_size: int
    class_names: list
    accuracy: float | None = None
    sensitivity: float | None = None
    specificity: float | None = None
    model_size_mb: float | None = None
    tflite_size_mb: float | None = None
    training_date: str | None = None


# ---------------------------------------------------------------------------
# Helper: store prediction history
# ---------------------------------------------------------------------------
async def _store_prediction_history(
    result: dict,
    filename: str,
    current_user: Optional[dict],
):
    """Store prediction result in MongoDB. Fail-safe: never breaks the response."""
    try:
        user_id = str(current_user["_id"]) if current_user else None
        record = PredictionRecord(
            user_id=user_id,
            image_filename=filename,
            prediction_result=result["prediction"],
            confidence=result["confidence"],
            probabilities=result["probabilities"],
            quality_warning=result.get("quality_warning"),
            advice=result["advice"],
        )
        db = get_database()
        await db.predictions.insert_one(record.model_dump())
    except Exception as e:
        logger.warning(f"Failed to save prediction history: {e}")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        model_loaded=(
            prediction_pipeline is not None and prediction_pipeline.model is not None
        ),
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Upload a cattle skin image and receive LSD diagnosis."""
    if prediction_pipeline is None or prediction_pipeline.model is None:
        raise HTTPException(
            status_code=503,
            detail="No trained model available. Train a model first via POST /train",
        )

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    image_bytes = await file.read()
    if len(image_bytes) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

    try:
        result = prediction_pipeline.predict(image_bytes)
        await _store_prediction_history(result, file.filename or "unknown", current_user)
        return PredictionResponse(**result)
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/gradcam", response_model=GradCAMResponse)
async def predict_with_gradcam(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Upload image and get prediction with Grad-CAM heatmap visualization."""
    if prediction_pipeline is None or prediction_pipeline.model is None:
        raise HTTPException(
            status_code=503,
            detail="No trained model available. Train a model first via POST /train",
        )

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    image_bytes = await file.read()
    if len(image_bytes) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

    try:
        result = prediction_pipeline.predict_with_gradcam(image_bytes)
        await _store_prediction_history(result, file.filename or "unknown", current_user)
        return GradCAMResponse(**result)
    except Exception as e:
        logger.error(f"Prediction with Grad-CAM failed: {e}")
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")


# ---------------------------------------------------------------------------
# Prediction History
# ---------------------------------------------------------------------------

@app.get("/predictions", response_model=list[PredictionHistoryResponse])
async def get_prediction_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Retrieve the authenticated user's prediction history (most recent first)."""
    db = get_database()
    user_id = str(current_user["_id"])

    cursor = (
        db.predictions.find({"user_id": user_id})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    results = []
    async for doc in cursor:
        results.append(
            PredictionHistoryResponse(
                id=str(doc["_id"]),
                image_filename=doc["image_filename"],
                prediction_result=doc["prediction_result"],
                confidence=doc["confidence"],
                probabilities=doc.get("probabilities", {}),
                quality_warning=doc.get("quality_warning"),
                advice=doc.get("advice", ""),
                created_at=doc["created_at"],
            )
        )

    return results


@app.delete("/predictions/{prediction_id}", status_code=204)
async def delete_prediction(
    prediction_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a specific prediction from the authenticated user's history."""
    db = get_database()
    user_id = str(current_user["_id"])

    try:
        obj_id = ObjectId(prediction_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid prediction ID")

    result = await db.predictions.delete_one({"_id": obj_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Training & Model
# ---------------------------------------------------------------------------

def _run_training_and_reload():
    """Background task: run training pipeline then reload prediction model."""
    global prediction_pipeline
    try:
        training_pipeline.run()
        if prediction_pipeline is None:
            prediction_pipeline = PredictionPipeline()
        else:
            prediction_pipeline.reload_model()
        logger.info("Prediction pipeline reloaded with new model")
    except Exception as e:
        logger.error(f"Training background task failed: {e}")


@app.post("/train")
async def start_training(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(require_role(UserRole.ADMIN)),
):
    """Start model training as a background task. Requires admin role."""
    if training_pipeline.is_running:
        raise HTTPException(status_code=409, detail="Training is already in progress")

    background_tasks.add_task(_run_training_and_reload)

    return {
        "message": "Training started",
        "status_url": "/train/status",
    }


@app.get("/train/status", response_model=TrainingStatusResponse)
def get_training_status(current_user: dict = Depends(require_role(UserRole.ADMIN))):
    """Check current training pipeline status. Requires admin role."""
    return TrainingStatusResponse(
        status=training_pipeline.status,
        progress=training_pipeline.progress,
        error=training_pipeline.error,
        metrics=training_pipeline.metrics,
        elapsed_seconds=training_pipeline.get_elapsed_time(),
    )


@app.get("/model/info", response_model=ModelInfoResponse)
def get_model_info(current_user: dict = Depends(require_role(UserRole.ADMIN))):
    """Return trained model metadata. Requires admin role."""
    model_info_path = BASE_DIR / "artifacts" / "models" / "model_info.json"

    if not model_info_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No model info found. Train a model first via POST /train",
        )

    try:
        info = load_json(model_info_path)
        return ModelInfoResponse(**info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model info: {e}")
