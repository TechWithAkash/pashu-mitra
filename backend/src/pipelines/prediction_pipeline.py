import base64
import io
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from src.exception import CustomException
from src.logger import logger
from src.utils import (
    PredictionConfig,
    check_image_quality,
    generate_gradcam,
    load_json,
    overlay_gradcam,
)


class PredictionPipeline:
    def __init__(self, config: PredictionConfig = None):
        self.config = config or PredictionConfig()
        self.model = None
        self._load_model()

    def _load_model(self):
        """Load Keras model from disk. Gracefully handles missing model."""
        try:
            if not self.config.model_path.exists():
                logger.warning(
                    f"Model file not found: {self.config.model_path}. "
                    "Train a model first via /train endpoint."
                )
                return

            import tensorflow as tf

            self.model = tf.keras.models.load_model(self.config.model_path)
            logger.info(f"Model loaded from {self.config.model_path}")

            # Load class names from model_info.json if available
            model_info_path = self.config.model_path.parent / "model_info.json"
            if model_info_path.exists():
                model_info = load_json(model_info_path)
                self.config.class_names = model_info.get(
                    "class_names", self.config.class_names
                )
                logger.info(f"Class names loaded: {self.config.class_names}")

        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model = None

    def reload_model(self):
        """Reload model from disk (called after training completes)."""
        self.model = None
        self._load_model()

    def preprocess_image(self, image_bytes: bytes) -> tuple:
        """
        Preprocess uploaded image for model input.
        Returns (preprocessed_array shape (1,H,W,3), original PIL Image).
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img = img.convert("RGB")
            original_img = img.copy()

            img = img.resize(
                (self.config.img_size, self.config.img_size), Image.BILINEAR
            )
            img_array = np.array(img, dtype=np.float32) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            return img_array, original_img

        except Exception as e:
            raise CustomException(str(e), sys)

    def validate_image(self, image_bytes: bytes) -> tuple:
        """
        Run quality check on uploaded image.
        Returns (is_valid, reason).
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img_array = np.array(img.convert("RGB"))
            return check_image_quality(img_array)
        except Exception as e:
            return False, f"Could not process image: {str(e)}"

    def predict(self, image_bytes: bytes) -> dict:
        """
        Full prediction: validate -> preprocess -> predict -> format result.
        """
        try:
            if self.model is None:
                raise ValueError("No trained model available. Train a model first.")

            # Quality check (warn but don't block)
            is_valid, quality_reason = self.validate_image(image_bytes)
            quality_warning = None if is_valid else quality_reason

            # Preprocess
            img_array, _ = self.preprocess_image(image_bytes)

            # Predict
            predictions = self.model.predict(img_array, verbose=0)
            predicted_index = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][predicted_index])
            predicted_class = self.config.class_names[predicted_index]

            # Probabilities for all classes
            probabilities = {
                name: float(predictions[0][i])
                for i, name in enumerate(self.config.class_names)
            }

            # Advice
            advice = self._generate_advice(predicted_class, confidence)

            result = {
                "prediction": predicted_class,
                "confidence": round(confidence, 4),
                "probabilities": {k: round(v, 4) for k, v in probabilities.items()},
                "quality_warning": quality_warning,
                "advice": advice,
            }

            logger.info(
                f"Prediction: {predicted_class} ({confidence:.2%})"
                f"{' [quality warning]' if quality_warning else ''}"
            )

            return result

        except Exception as e:
            raise CustomException(str(e), sys)

    def predict_with_gradcam(self, image_bytes: bytes) -> dict:
        """
        Predict with Grad-CAM heatmap visualization.
        Returns prediction dict with additional 'gradcam_image' field (base64 PNG).
        """
        try:
            if self.model is None:
                raise ValueError("No trained model available. Train a model first.")

            # Get base prediction
            result = self.predict(image_bytes)

            # Generate Grad-CAM
            img_array, original_img = self.preprocess_image(image_bytes)

            predicted_index = self.config.class_names.index(result["prediction"])
            heatmap = generate_gradcam(self.model, img_array, class_index=predicted_index)

            # Resize original image to match model input size for overlay
            original_resized = np.array(
                original_img.resize(
                    (self.config.img_size, self.config.img_size), Image.BILINEAR
                )
            )
            overlay = overlay_gradcam(original_resized, heatmap)

            # Encode overlay as base64 PNG
            overlay_img = Image.fromarray(overlay)
            buffer = io.BytesIO()
            overlay_img.save(buffer, format="PNG")
            gradcam_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

            result["gradcam_image"] = gradcam_base64

            logger.info("Grad-CAM heatmap generated")
            return result

        except Exception as e:
            raise CustomException(str(e), sys)

    def _generate_advice(self, prediction: str, confidence: float) -> str:
        """Generate simple, numbered advice steps for farmers."""
        threshold = self.config.confidence_threshold

        if "lumpy" in prediction.lower():
            if confidence >= threshold:
                return (
                    "1. Keep this animal away from other animals right now.\n"
                    "2. Call your veterinarian today — do not wait.\n"
                    "3. Do not move this animal to another location.\n"
                    "4. Watch other animals for lumps or fever.\n"
                    "5. Early treatment helps — act quickly."
                )
            else:
                return (
                    "1. Watch this animal carefully for a few days.\n"
                    "2. Look for raised lumps or bumps on the skin.\n"
                    "3. Check if the animal has fever or is not eating.\n"
                    "4. Take a clearer photo and check again.\n"
                    "5. If you see lumps, call your veterinarian."
                )
        else:
            if confidence >= threshold:
                return (
                    "1. Your animal looks healthy — no signs of disease found.\n"
                    "2. Keep checking your animals regularly.\n"
                    "3. If you see lumps or bumps later, take a photo and check again.\n"
                    "4. Make sure your animals are vaccinated.\n"
                    "5. Good job keeping your animals healthy!"
                )
            else:
                return (
                    "1. We are not sure about this result.\n"
                    "2. Take a new photo in good daylight.\n"
                    "3. Make sure the skin area is clearly visible.\n"
                    "4. Try again with the new photo.\n"
                    "5. If you are worried, call your veterinarian."
                )
