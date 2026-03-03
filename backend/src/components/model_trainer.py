import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

from src.components.data_transformation import DataTransformationArtifact
from src.exception import CustomException
from src.logger import logger
from src.utils import ModelTrainerConfig, save_json


@dataclass
class ModelTrainerArtifact:
    model_path: Path
    tflite_path: Path
    tflite_quantized_path: Path
    metrics: dict
    training_history: dict
    class_names: list


class ModelTrainer:
    def __init__(self, config: ModelTrainerConfig = None):
        self.config = config or ModelTrainerConfig()
        self.model = None
        self.base_model = None

    def create_model(self):
        """Create transfer learning model with custom classification head."""
        try:
            import tensorflow as tf
            from tensorflow import keras
            from tensorflow.keras import layers
            from tensorflow.keras.applications import (
                DenseNet121,
                EfficientNetV2S,
                MobileNetV2,
                ResNet50V2,
            )

            input_shape = (self.config.img_size, self.config.img_size, 3)
            arch = self.config.architecture.lower()

            # Select base model
            if arch == "mobilenetv2":
                base_model = MobileNetV2(
                    input_shape=input_shape, include_top=False, weights="imagenet"
                )
            elif arch == "efficientnetv2s":
                base_model = EfficientNetV2S(
                    input_shape=input_shape, include_top=False, weights="imagenet"
                )
            elif arch == "resnet50v2":
                base_model = ResNet50V2(
                    input_shape=input_shape, include_top=False, weights="imagenet"
                )
            elif arch == "densenet121":
                base_model = DenseNet121(
                    input_shape=input_shape, include_top=False, weights="imagenet"
                )
            else:
                raise ValueError(f"Unknown architecture: {arch}")

            # Freeze base model initially
            base_model.trainable = False

            # Build classification head
            inputs = keras.Input(shape=input_shape)
            x = base_model(inputs, training=False)
            x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
            x = layers.BatchNormalization()(x)
            x = layers.Dropout(self.config.dropout_rate, name="dropout_1")(x)
            x = layers.Dense(self.config.dense_units, activation="relu", name="dense_1")(x)
            x = layers.BatchNormalization()(x)
            x = layers.Dropout(self.config.dropout_rate, name="dropout_2")(x)
            outputs = layers.Dense(
                self.config.num_classes, activation="softmax", name="predictions"
            )(x)

            model = keras.Model(inputs, outputs, name=f"lsd_detector_{arch}")

            self.model = model
            self.base_model = base_model

            logger.info(
                f"Model created: {arch.upper()}, "
                f"params: {model.count_params():,}, "
                f"base layers: {len(base_model.layers)}"
            )

            return model, base_model

        except Exception as e:
            raise CustomException(str(e), sys)

    def _compile_model(self, learning_rate: float):
        """Compile model with optimizer and metrics."""
        from tensorflow import keras

        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        loss = keras.losses.CategoricalCrossentropy(
            label_smoothing=self.config.label_smoothing
        )
        metrics = [
            "accuracy",
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
            keras.metrics.AUC(name="auc"),
        ]

        self.model.compile(optimizer=optimizer, loss=loss, metrics=metrics)
        logger.info(f"Model compiled with lr={learning_rate}")

    def _get_callbacks(self, phase_name: str, patience: int) -> list:
        """Create training callbacks."""
        from tensorflow.keras import callbacks

        self.config.models_dir.mkdir(parents=True, exist_ok=True)

        return [
            callbacks.EarlyStopping(
                monitor="val_loss",
                patience=patience,
                restore_best_weights=True,
                verbose=1,
            ),
            callbacks.ModelCheckpoint(
                filepath=str(self.config.models_dir / f"{phase_name}_best.keras"),
                monitor="val_accuracy",
                save_best_only=True,
                verbose=1,
            ),
            callbacks.ReduceLROnPlateau(
                monitor="val_loss",
                factor=0.5,
                patience=3,
                min_lr=1e-7,
                verbose=1,
            ),
        ]

    def train_phase1(self, train_ds, val_ds, class_weights: dict) -> dict:
        """Phase 1: Train classification head only (base frozen)."""
        try:
            logger.info("Phase 1: Training classification head (base frozen)")

            self._compile_model(self.config.learning_rate_phase1)
            callbacks_list = self._get_callbacks("phase1", self.config.patience_phase1)

            history = self.model.fit(
                train_ds,
                epochs=self.config.epochs_phase1,
                validation_data=val_ds,
                callbacks=callbacks_list,
                class_weight=class_weights,
                verbose=1,
            )

            logger.info("Phase 1 training complete")
            return history.history

        except Exception as e:
            raise CustomException(str(e), sys)

    def train_phase2(self, train_ds, val_ds, class_weights: dict) -> dict:
        """Phase 2: Fine-tune top layers of base model."""
        try:
            logger.info(
                f"Phase 2: Fine-tuning top {self.config.unfreeze_layers} layers"
            )

            # Unfreeze top layers
            self.base_model.trainable = True
            for layer in self.base_model.layers[: -self.config.unfreeze_layers]:
                layer.trainable = False

            trainable_count = sum(
                1 for layer in self.base_model.layers if layer.trainable
            )
            logger.info(
                f"Trainable layers in base: {trainable_count}/{len(self.base_model.layers)}"
            )

            self._compile_model(self.config.learning_rate_phase2)
            callbacks_list = self._get_callbacks("phase2_final", self.config.patience_phase2)

            history = self.model.fit(
                train_ds,
                epochs=self.config.epochs_phase2,
                validation_data=val_ds,
                callbacks=callbacks_list,
                class_weight=class_weights,
                verbose=1,
            )

            logger.info("Phase 2 training complete")
            return history.history

        except Exception as e:
            raise CustomException(str(e), sys)

    def evaluate(self, test_ds, class_names: list) -> dict:
        """Comprehensive model evaluation on test set."""
        try:
            logger.info("Evaluating model on test set")

            # Collect all predictions and true labels from the dataset
            all_predictions = []
            all_true_labels = []

            for images, labels in test_ds:
                preds = self.model.predict(images, verbose=0)
                all_predictions.append(preds)
                all_true_labels.append(labels.numpy())

            all_predictions = np.concatenate(all_predictions, axis=0)
            all_true_labels = np.concatenate(all_true_labels, axis=0)

            predicted_classes = np.argmax(all_predictions, axis=1)
            true_classes = np.argmax(all_true_labels, axis=1)

            # Core metrics
            accuracy = float(accuracy_score(true_classes, predicted_classes))
            precision = float(
                precision_score(true_classes, predicted_classes, average="weighted")
            )
            recall = float(
                recall_score(true_classes, predicted_classes, average="weighted")
            )
            f1 = float(f1_score(true_classes, predicted_classes, average="weighted"))

            # Confusion matrix
            cm = confusion_matrix(true_classes, predicted_classes)

            # Sensitivity and specificity (for binary classification)
            sensitivity = 0.0
            specificity = 0.0
            if cm.shape == (2, 2):
                tn, fp, fn, tp = cm.ravel()
                sensitivity = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
                specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0

            # Classification report
            report = classification_report(
                true_classes, predicted_classes, target_names=class_names, digits=4
            )
            logger.info(f"\n{report}")

            metrics = {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1_score": f1,
                "sensitivity": sensitivity,
                "specificity": specificity,
                "confusion_matrix": cm.tolist(),
            }

            # Save metrics
            self.config.results_dir.mkdir(parents=True, exist_ok=True)
            save_json(metrics, self.config.results_dir / "evaluation_metrics.json")

            logger.info(
                f"Evaluation - Accuracy: {accuracy:.4f}, Sensitivity: {sensitivity:.4f}, "
                f"Specificity: {specificity:.4f}"
            )

            return metrics

        except Exception as e:
            raise CustomException(str(e), sys)

    def export_model(self, model_name: str = "lsd_detector") -> dict:
        """Export model in multiple formats for deployment."""
        try:
            import tensorflow as tf

            logger.info("Exporting model for deployment")
            self.config.models_dir.mkdir(parents=True, exist_ok=True)

            # 1. Save as .keras file
            keras_path = self.config.models_dir / f"{model_name}_best.keras"
            self.model.save(keras_path)
            logger.info(f"Saved Keras model: {keras_path}")

            # 2. TFLite
            converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            tflite_model = converter.convert()

            tflite_path = self.config.models_dir / f"{model_name}.tflite"
            with open(tflite_path, "wb") as f:
                f.write(tflite_model)
            logger.info(
                f"Saved TFLite: {tflite_path} "
                f"({tflite_path.stat().st_size / 1024 / 1024:.2f} MB)"
            )

            # 3. Quantized TFLite (float16)
            converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            converter.target_spec.supported_types = [tf.float16]
            tflite_quant_model = converter.convert()

            tflite_quant_path = self.config.models_dir / f"{model_name}_quantized.tflite"
            with open(tflite_quant_path, "wb") as f:
                f.write(tflite_quant_model)
            logger.info(
                f"Saved Quantized TFLite: {tflite_quant_path} "
                f"({tflite_quant_path.stat().st_size / 1024 / 1024:.2f} MB)"
            )

            logger.info("Model export complete")
            return {
                "keras": keras_path,
                "tflite": tflite_path,
                "tflite_quantized": tflite_quant_path,
            }

        except Exception as e:
            raise CustomException(str(e), sys)

    def run(self, data_transformation_artifact: DataTransformationArtifact) -> ModelTrainerArtifact:
        """Full training pipeline: create -> phase1 -> phase2 -> evaluate -> export."""
        try:
            logger.info("Model training started")

            train_ds = data_transformation_artifact.train_dataset
            val_ds = data_transformation_artifact.val_dataset
            test_ds = data_transformation_artifact.test_dataset
            class_names = data_transformation_artifact.class_names
            class_weights = data_transformation_artifact.class_weights

            # Create model
            self.create_model()

            # Phase 1: Train classifier head
            history1 = self.train_phase1(train_ds, val_ds, class_weights)

            # Phase 2: Fine-tune
            history2 = self.train_phase2(train_ds, val_ds, class_weights)

            # Merge training histories
            training_history = {
                "phase1": history1,
                "phase2": history2,
            }

            # Evaluate
            metrics = self.evaluate(test_ds, class_names)

            # Export
            export_paths = self.export_model("lsd_detector")

            # Save model info
            model_info = {
                "architecture": self.config.architecture,
                "img_size": self.config.img_size,
                "class_names": class_names,
                "accuracy": metrics["accuracy"],
                "sensitivity": metrics["sensitivity"],
                "specificity": metrics["specificity"],
                "model_size_mb": round(
                    export_paths["keras"].stat().st_size / 1024 / 1024, 2
                ),
                "tflite_size_mb": round(
                    export_paths["tflite"].stat().st_size / 1024 / 1024, 2
                ),
                "training_date": datetime.now().isoformat(),
                "epochs_phase1": self.config.epochs_phase1,
                "epochs_phase2": self.config.epochs_phase2,
            }
            save_json(model_info, self.config.models_dir / "model_info.json")

            artifact = ModelTrainerArtifact(
                model_path=export_paths["keras"],
                tflite_path=export_paths["tflite"],
                tflite_quantized_path=export_paths["tflite_quantized"],
                metrics=metrics,
                training_history=training_history,
                class_names=class_names,
            )

            logger.info("Model training completed successfully")
            return artifact

        except Exception as e:
            raise CustomException(str(e), sys)
