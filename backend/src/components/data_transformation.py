import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image

from src.components.data_ingestion import DataIngestionArtifact
from src.exception import CustomException
from src.logger import logger
from src.utils import DataTransformationConfig, check_image_quality, compute_class_weights

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}


@dataclass
class DataTransformationArtifact:
    train_dataset: Any  # tf.data.Dataset
    val_dataset: Any
    test_dataset: Any
    class_names: list
    class_indices: dict
    class_weights: dict
    num_train_samples: int = 0
    num_val_samples: int = 0
    num_test_samples: int = 0


class DataTransformation:
    def __init__(self, config: DataTransformationConfig = None):
        self.config = config or DataTransformationConfig()

    def clean_split_data(self, split_dir: Path) -> dict:
        """
        Clean training data by removing corrupted and low-quality images.
        Only cleans training set aggressively; val/test only removes corrupted files.
        """
        try:
            logger.info("Starting data cleaning")
            stats = {"total": 0, "removed_corrupted": 0, "removed_quality": 0}

            for split_name in ["train", "val", "test"]:
                split_path = split_dir / split_name
                if not split_path.exists():
                    continue

                aggressive = split_name == "train"

                for class_dir in split_path.iterdir():
                    if not class_dir.is_dir():
                        continue

                    for img_path in list(class_dir.iterdir()):
                        if img_path.suffix.lower() not in IMAGE_EXTENSIONS:
                            continue

                        stats["total"] += 1

                        # Check if image can be opened
                        try:
                            img = Image.open(img_path)
                            img.verify()
                            # Re-open after verify (verify closes the file)
                            img = Image.open(img_path)

                            # Convert to RGB if needed and re-save
                            if img.mode != "RGB":
                                img = img.convert("RGB")
                                img.save(img_path, "JPEG", quality=95)

                        except Exception:
                            logger.warning(f"Corrupted image removed: {img_path}")
                            img_path.unlink()
                            stats["removed_corrupted"] += 1
                            continue

                        # Aggressive quality check for training data only
                        if aggressive:
                            is_valid, reason = check_image_quality(
                                img_path,
                                blur_threshold=self.config.blur_threshold,
                                brightness_range=self.config.brightness_range,
                                min_size=self.config.min_image_size,
                                max_size=self.config.max_image_size,
                            )
                            if not is_valid:
                                logger.warning(
                                    f"Low quality image removed ({reason}): {img_path}"
                                )
                                img_path.unlink()
                                stats["removed_quality"] += 1

            logger.info(
                f"Cleaning complete - Total: {stats['total']}, "
                f"Corrupted removed: {stats['removed_corrupted']}, "
                f"Quality removed: {stats['removed_quality']}"
            )
            return stats

        except Exception as e:
            raise CustomException(str(e), sys)

    def create_datasets(self, split_dir: Path) -> DataTransformationArtifact:
        """
        Create tf.data.Dataset pipelines for train/val/test using
        tf.keras.utils.image_dataset_from_directory (replaces deprecated
        ImageDataGenerator).
        """
        try:
            import tensorflow as tf

            logger.info("Creating tf.data datasets")

            img_size = self.config.img_size
            batch_size = self.config.batch_size

            # Load datasets from directories (returns int labels by default)
            train_ds = tf.keras.utils.image_dataset_from_directory(
                str(split_dir / "train"),
                image_size=(img_size, img_size),
                batch_size=batch_size,
                label_mode="categorical",
                shuffle=True,
                seed=self.config.seed,
            )

            val_ds = tf.keras.utils.image_dataset_from_directory(
                str(split_dir / "val"),
                image_size=(img_size, img_size),
                batch_size=batch_size,
                label_mode="categorical",
                shuffle=False,
            )

            test_ds = tf.keras.utils.image_dataset_from_directory(
                str(split_dir / "test"),
                image_size=(img_size, img_size),
                batch_size=batch_size,
                label_mode="categorical",
                shuffle=False,
            )

            # Extract class info
            class_names = sorted(train_ds.class_names)
            class_indices = {name: i for i, name in enumerate(class_names)}

            num_train = train_ds.cardinality().numpy()
            num_val = val_ds.cardinality().numpy()
            num_test = test_ds.cardinality().numpy()

            # Count individual samples for logging
            train_count = sum(1 for _ in train_ds.unbatch())
            val_count = sum(1 for _ in val_ds.unbatch())
            test_count = sum(1 for _ in test_ds.unbatch())

            # Compute class weights from training dataset
            class_weights = compute_class_weights(train_ds)

            # Rescaling layer (pixel values 0-255 -> 0-1)
            rescale = tf.keras.layers.Rescaling(1.0 / 255)

            # Augmentation layers for training only
            augmentation = tf.keras.Sequential([
                tf.keras.layers.RandomFlip("horizontal"),
                tf.keras.layers.RandomRotation(0.05),
                tf.keras.layers.RandomZoom(0.2),
                tf.keras.layers.RandomTranslation(0.2, 0.2),
                tf.keras.layers.RandomBrightness(0.2),
            ], name="augmentation")

            # Apply augmentation + rescaling to training set
            train_ds = train_ds.map(
                lambda x, y: (augmentation(rescale(x), training=True), y),
                num_parallel_calls=tf.data.AUTOTUNE,
            )

            # Apply rescaling only to val/test
            val_ds = val_ds.map(
                lambda x, y: (rescale(x), y),
                num_parallel_calls=tf.data.AUTOTUNE,
            )
            test_ds = test_ds.map(
                lambda x, y: (rescale(x), y),
                num_parallel_calls=tf.data.AUTOTUNE,
            )

            # Prefetch for performance
            train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
            val_ds = val_ds.prefetch(tf.data.AUTOTUNE)
            test_ds = test_ds.prefetch(tf.data.AUTOTUNE)

            logger.info(
                f"Datasets created - Train: {train_count}, "
                f"Val: {val_count}, Test: {test_count}"
            )
            logger.info(f"Classes: {class_indices}")

            return DataTransformationArtifact(
                train_dataset=train_ds,
                val_dataset=val_ds,
                test_dataset=test_ds,
                class_names=class_names,
                class_indices=class_indices,
                class_weights=class_weights,
                num_train_samples=train_count,
                num_val_samples=val_count,
                num_test_samples=test_count,
            )

        except Exception as e:
            raise CustomException(str(e), sys)

    def run(self, data_ingestion_artifact: DataIngestionArtifact) -> DataTransformationArtifact:
        """Public entry point."""
        try:
            logger.info("Data transformation started")
            split_dir = data_ingestion_artifact.train_dir.parent

            # Clean the split data
            self.clean_split_data(split_dir)

            # Create tf.data datasets
            artifact = self.create_datasets(split_dir)

            logger.info("Data transformation completed")
            return artifact

        except Exception as e:
            raise CustomException(str(e), sys)
