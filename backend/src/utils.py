import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from src.exception import CustomException
from src.logger import logger

# Base directory: points to backend/
BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------------------------
# Configuration Dataclasses
# ---------------------------------------------------------------------------

@dataclass
class DataIngestionConfig:
    dataset_path: Path = BASE_DIR / "datasets" / "Lumpy Skin Images Dataset"
    artifacts_dir: Path = BASE_DIR / "artifacts"
    split_dir: Path = BASE_DIR / "artifacts" / "data_splits"
    train_split: float = 0.70
    val_split: float = 0.15
    test_split: float = 0.15
    seed: int = 42


@dataclass
class DataTransformationConfig:
    img_size: int = 224
    batch_size: int = 32
    blur_threshold: float = 100.0
    brightness_range: tuple = (20, 235)
    min_image_size: int = 100
    max_image_size: int = 5000
    seed: int = 42


@dataclass
class ModelTrainerConfig:
    architecture: str = "mobilenetv2"
    num_classes: int = 2
    img_size: int = 224
    epochs_phase1: int = 15
    epochs_phase2: int = 25
    learning_rate_phase1: float = 1e-3
    learning_rate_phase2: float = 1e-5
    unfreeze_layers: int = 30
    patience_phase1: int = 5
    patience_phase2: int = 7
    label_smoothing: float = 0.1
    dropout_rate: float = 0.3
    dense_units: int = 256
    models_dir: Path = BASE_DIR / "artifacts" / "models"
    results_dir: Path = BASE_DIR / "artifacts" / "results"


@dataclass
class PredictionConfig:
    model_path: Path = BASE_DIR / "artifacts" / "models" / "lsd_detector_best.keras"
    img_size: int = 224
    confidence_threshold: float = 0.7
    class_names: list = field(default_factory=lambda: ["Lumpy Skin", "Normal Skin"])


# ---------------------------------------------------------------------------
# Image Quality Check
# ---------------------------------------------------------------------------

def check_image_quality(
    image_input,
    blur_threshold: float = 100.0,
    brightness_range: tuple = (20, 235),
    min_size: int = 100,
    max_size: int = 5000,
) -> tuple:
    """
    Validate image quality. Accepts a file path (str/Path) or numpy array.
    Returns (is_valid: bool, reason: str).
    """
    try:
        if isinstance(image_input, (str, Path)):
            img = Image.open(image_input)
            img_array = np.array(img)
        elif isinstance(image_input, np.ndarray):
            img_array = image_input
            img = Image.fromarray(img_array)
        elif isinstance(image_input, Image.Image):
            img = image_input
            img_array = np.array(img)
        else:
            return False, f"Unsupported input type: {type(image_input)}"

        # Dimension checks
        h, w = img_array.shape[:2]
        if w < min_size or h < min_size:
            return False, f"Too small: {w}x{h}"
        if w > max_size or h > max_size:
            return False, f"Too large: {w}x{h}"

        # Shape check
        if len(img_array.shape) not in [2, 3]:
            return False, "Invalid image shape"

        # Blur detection via Laplacian variance
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array

        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < blur_threshold:
            return False, f"Too blurry (score: {laplacian_var:.1f})"

        # Brightness check
        mean_brightness = float(np.mean(img_array))
        if mean_brightness < brightness_range[0]:
            return False, f"Too dark (brightness: {mean_brightness:.1f})"
        if mean_brightness > brightness_range[1]:
            return False, f"Too bright (brightness: {mean_brightness:.1f})"

        return True, "OK"

    except Exception as e:
        return False, f"Error: {str(e)}"


# ---------------------------------------------------------------------------
# Grad-CAM
# ---------------------------------------------------------------------------

def generate_gradcam(model, img_array, class_index=None, layer_name=None):
    """
    Generate Grad-CAM heatmap for model interpretability.

    Args:
        model: Keras model
        img_array: preprocessed image, shape (1, H, W, 3)
        class_index: target class index (None = use predicted class)
        layer_name: conv layer name (None = auto-detect last conv layer)

    Returns:
        heatmap as numpy array (0-255, uint8), shape (H, W)
    """
    import tensorflow as tf

    # Auto-detect last conv layer
    if layer_name is None:
        for layer in reversed(model.layers):
            if len(layer.output_shape) == 4:
                layer_name = layer.name
                break
        if layer_name is None:
            raise ValueError("Could not find a convolutional layer in the model")

    grad_model = tf.keras.Model(
        inputs=model.input,
        outputs=[model.get_layer(layer_name).output, model.output],
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        if class_index is None:
            class_index = tf.argmax(predictions[0])
        class_score = predictions[:, class_index]

    grads = tape.gradient(class_score, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    heatmap = heatmap.numpy()

    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.resize(heatmap, (img_array.shape[2], img_array.shape[1]))

    return heatmap


def overlay_gradcam(original_image: np.ndarray, heatmap: np.ndarray, alpha: float = 0.4) -> np.ndarray:
    """
    Apply Grad-CAM heatmap as colored overlay on original image.
    Returns RGB numpy array (uint8).
    """
    colormap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    colormap = cv2.cvtColor(colormap, cv2.COLOR_BGR2RGB)

    if original_image.max() <= 1.0:
        original_image = np.uint8(original_image * 255)

    overlay = cv2.addWeighted(original_image, 1 - alpha, colormap, alpha, 0)
    return overlay


# ---------------------------------------------------------------------------
# Class Weights
# ---------------------------------------------------------------------------

def compute_class_weights(dataset) -> dict:
    """Compute class weights to handle class imbalance.

    Accepts a tf.data.Dataset with categorical (one-hot) labels.
    """
    from sklearn.utils.class_weight import compute_class_weight

    # Collect all labels from the dataset
    all_labels = []
    for _, labels in dataset.unbatch():
        all_labels.append(int(np.argmax(labels.numpy())))

    all_labels = np.array(all_labels)
    classes = np.unique(all_labels)
    weights = compute_class_weight("balanced", classes=classes, y=all_labels)
    class_weight_dict = dict(zip(classes, weights))
    logger.info(f"Computed class weights: {class_weight_dict}")
    return class_weight_dict


# ---------------------------------------------------------------------------
# JSON Helpers
# ---------------------------------------------------------------------------

def save_json(data: dict, filepath: Path):
    """Save dict as JSON."""
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2, default=str)
    logger.info(f"Saved JSON to {filepath}")


def load_json(filepath: Path) -> dict:
    """Load JSON file as dict."""
    with open(filepath, "r") as f:
        return json.load(f)
