import os
import random
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

from sklearn.model_selection import train_test_split

from src.exception import CustomException
from src.logger import logger
from src.utils import DataIngestionConfig

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}


@dataclass
class DataIngestionArtifact:
    train_dir: Path
    val_dir: Path
    test_dir: Path
    class_names: list
    split_stats: dict


class DataIngestion:
    def __init__(self, config: DataIngestionConfig = None):
        self.config = config or DataIngestionConfig()

    def verify_dataset_structure(self) -> tuple:
        """
        Verify dataset has proper class subdirectories with images.
        Returns (class_distribution dict, total_count).
        """
        try:
            data_path = self.config.dataset_path
            if not data_path.exists():
                raise FileNotFoundError(f"Dataset path not found: {data_path}")

            subdirs = [d for d in data_path.iterdir() if d.is_dir()]
            if len(subdirs) == 0:
                raise FileNotFoundError(f"No class folders found in {data_path}")

            class_distribution = {}
            total_images = 0

            for subdir in sorted(subdirs):
                image_files = [
                    f for f in subdir.iterdir()
                    if f.suffix.lower() in IMAGE_EXTENSIONS
                ]
                count = len(image_files)
                class_distribution[subdir.name] = count
                total_images += count
                logger.info(f"Class '{subdir.name}': {count} images")

            logger.info(f"Dataset verified: {len(subdirs)} classes, {total_images} total images")
            return class_distribution, total_images

        except Exception as e:
            raise CustomException(str(e), sys)

    def split_dataset(self) -> DataIngestionArtifact:
        """
        Split dataset into train/val/test with stratification.
        Copies files into artifacts/data_splits/{train,val,test}/{class_name}/.
        """
        try:
            logger.info("Starting dataset splitting")
            class_distribution, total = self.verify_dataset_structure()

            split_dir = self.config.split_dir
            # Clean existing splits if present
            if split_dir.exists():
                shutil.rmtree(split_dir)
                logger.info(f"Cleaned existing split directory: {split_dir}")

            # Create split directories
            for split_name in ["train", "val", "test"]:
                (split_dir / split_name).mkdir(parents=True, exist_ok=True)

            split_stats = {}

            for class_name in class_distribution:
                class_path = self.config.dataset_path / class_name

                # Create class directories in each split
                for split_name in ["train", "val", "test"]:
                    (split_dir / split_name / class_name).mkdir(parents=True, exist_ok=True)

                # Gather all image paths
                image_files = sorted([
                    f for f in class_path.iterdir()
                    if f.suffix.lower() in IMAGE_EXTENSIONS
                ])

                if len(image_files) == 0:
                    logger.warning(f"No images found for class '{class_name}'")
                    continue

                # Stratified split using sklearn
                # First: split off test set
                train_val_files, test_files = train_test_split(
                    image_files,
                    test_size=self.config.test_split,
                    random_state=self.config.seed,
                )

                # Second: split train_val into train and val
                val_ratio_adjusted = self.config.val_split / (
                    self.config.train_split + self.config.val_split
                )
                train_files, val_files = train_test_split(
                    train_val_files,
                    test_size=val_ratio_adjusted,
                    random_state=self.config.seed,
                )

                # Copy files to split directories
                for img_file in train_files:
                    shutil.copy2(img_file, split_dir / "train" / class_name / img_file.name)
                for img_file in val_files:
                    shutil.copy2(img_file, split_dir / "val" / class_name / img_file.name)
                for img_file in test_files:
                    shutil.copy2(img_file, split_dir / "test" / class_name / img_file.name)

                split_stats[class_name] = {
                    "total": len(image_files),
                    "train": len(train_files),
                    "val": len(val_files),
                    "test": len(test_files),
                }

                logger.info(
                    f"Class '{class_name}': train={len(train_files)}, "
                    f"val={len(val_files)}, test={len(test_files)}"
                )

            class_names = sorted(class_distribution.keys())

            artifact = DataIngestionArtifact(
                train_dir=split_dir / "train",
                val_dir=split_dir / "val",
                test_dir=split_dir / "test",
                class_names=class_names,
                split_stats=split_stats,
            )

            logger.info("Dataset splitting completed successfully")
            return artifact

        except Exception as e:
            raise CustomException(str(e), sys)

    def run(self) -> DataIngestionArtifact:
        """Public entry point."""
        logger.info("Data ingestion started")
        artifact = self.split_dataset()
        logger.info("Data ingestion completed")
        return artifact
