import sys
import time

from src.components.data_ingestion import DataIngestion
from src.components.data_transformation import DataTransformation
from src.components.model_trainer import ModelTrainer
from src.exception import CustomException
from src.logger import logger


class TrainingPipeline:
    def __init__(self):
        self.is_running: bool = False
        self.status: str = "idle"  # idle | running | completed | failed
        self.progress: str = ""
        self.error: str | None = None
        self.metrics: dict | None = None
        self.start_time: float | None = None
        self.end_time: float | None = None

    def run(self):
        """
        Full training pipeline:
        data ingestion -> data transformation -> model training.
        """
        if self.is_running:
            logger.warning("Training is already in progress")
            return

        self.is_running = True
        self.status = "running"
        self.error = None
        self.metrics = None
        self.start_time = time.time()
        self.end_time = None

        try:
            # Stage 1: Data Ingestion
            self.progress = "Data ingestion: verifying and splitting dataset..."
            logger.info(self.progress)
            data_ingestion = DataIngestion()
            ingestion_artifact = data_ingestion.run()

            # Stage 2: Data Transformation
            self.progress = "Data transformation: cleaning and creating generators..."
            logger.info(self.progress)
            data_transformation = DataTransformation()
            transformation_artifact = data_transformation.run(ingestion_artifact)

            # Stage 3: Model Training
            self.progress = "Model training: Phase 1 - training classification head..."
            logger.info(self.progress)
            model_trainer = ModelTrainer()
            trainer_artifact = model_trainer.run(transformation_artifact)

            # Done
            self.status = "completed"
            self.progress = "Training completed successfully"
            self.metrics = trainer_artifact.metrics
            self.end_time = time.time()

            logger.info(
                f"Training pipeline completed in "
                f"{self.end_time - self.start_time:.1f} seconds"
            )

        except Exception as e:
            self.status = "failed"
            self.error = str(e)
            self.end_time = time.time()
            logger.error(f"Training pipeline failed: {e}")
            raise CustomException(str(e), sys)

        finally:
            self.is_running = False

    def get_elapsed_time(self) -> float | None:
        """Return elapsed time in seconds."""
        if self.start_time is None:
            return None
        end = self.end_time or time.time()
        return round(end - self.start_time, 1)


if __name__ == "__main__":
    pipeline = TrainingPipeline()
    pipeline.run()
