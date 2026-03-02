# 🐄 Lumpy Skin Disease (LSD) Detection System

> **AI-powered early detection of Lumpy Skin Disease in cattle using computer vision**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![TensorFlow 2.13+](https://img.shields.io/badge/TensorFlow-2.13%2B-orange.svg)](https://tensorflow.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com)

---

## 📋 PROJECT ROADMAP & SYSTEM DESIGN

### 1. Disease Problem Analysis

**Lumpy Skin Disease (LSD)** is a viral disease (Capripoxvirus) affecting cattle worldwide, causing:

| Symptom | Visual Indicator | Detection Difficulty |
|---------|-------------------|---------------------|
| Skin nodules (2-5 cm) | Raised, firm, circular lumps on skin | Highly detectable via images |
| Fever & weight loss | Behavioral (not visual) | Not detectable from images |
| Reduced milk yield | Behavioral | Not detectable from images |
| Lymph node swelling | Subtle visual changes | Moderate difficulty |
| Skin necrosis | Darkened, damaged skin areas | Detectable in advanced cases |

**Real-world challenges:**
- Farmers often lack veterinary access in rural areas
- Early detection is critical (treatment within 48 hours improves outcomes)
- Manual inspection is slow and error-prone across large herds
- Internet connectivity is limited in many farming regions

### 2. Solution Architecture

```
+----------------------------------------------------------+
|                  LSD DETECTION SYSTEM                     |
+--------------+--------------+--------------+--------------+
|  Input       |  AI Core     |  Output      |  Deploy      |
+--------------+--------------+--------------+--------------+
| Camera/      | MobileNetV2  | Diagnosis    | Flask Web    |
| Upload Image | Transfer     | + Confidence | Mobile-Ready |
|              | Learning     | + Grad-CAM   | Offline      |
| Preprocess   | Fine-tuned   | Heatmap      | TFLite       |
| 224x224 RGB  | 2-Phase      | + Actionable | REST API     |
|              | Training     | Advice       |              |
+--------------+--------------+--------------+--------------+
```

### 3. Model Selection Rationale

| Model | Accuracy | Speed | Size | Decision |
|-------|----------|-------|------|----------|
| **MobileNetV2** | High | Fast | ~14 MB | **Selected** - best for mobile/edge |
| EfficientNetB0 | Higher | Medium | ~29 MB | Alternative for server-only |
| ResNet50 | Highest | Slow | ~98 MB | Too large for mobile/edge |

### 4. Training Strategy

- **Phase 1**: Train classifier head only (base frozen), LR=1e-3, 15 epochs
- **Phase 2**: Fine-tune top 30 layers, LR=1e-5, 25 epochs
- **Data Split**: 70% train / 15% validation / 15% test
- **Augmentation**: Rotation, flip, zoom, brightness, shift
- **Label Smoothing**: 0.1 (reduces overconfidence)

### 5. Edge Cases & Limitations

| Edge Case | Mitigation |
|-----------|------------|
| Blurry/dark images | Quality check before prediction + user warning |
| Other skin diseases | Confidence thresholding + "uncertain" category |
| Non-cattle images | Pre-filtering with confidence score |
| Partial nodule visibility | Augmentation with cropping during training |
| Extreme lighting | Brightness augmentation + histogram equalization |

---

## Quick Start

### Local Setup
```bash
# Create virtual environment
uv venv
.venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Train the model
python -m src.pipelines.training_pipeline

# Run the web application
python main.py
```

### Google Colab
Open `notebooks/LSD_Detection_Colab_Version.ipynb` in Google Colab for GPU-accelerated training.

---

## Project Structure

```
LUMMY DISEASE DETECTION/
├── main.py                          # Flask web application entry point
├── requirements.txt                 # Python dependencies
├── setup.py                         # Package setup
│
├── src/                             # Source code package
│   ├── exception.py                 # Custom exception handling
│   ├── logger.py                    # Logging configuration
│   ├── utils.py                     # Utility functions (Grad-CAM, quality checks)
│   ├── components/
│   │   ├── data_ingestion.py        # Dataset loading & splitting
│   │   ├── data_transformation.py   # Preprocessing & augmentation
│   │   └── model_trainer.py         # Model building & training
│   └── pipelines/
│       ├── training_pipeline.py     # Full training workflow
│       └── prediction_pipeline.py   # Inference + Grad-CAM explainability
│
├── datasets/                        # Raw image dataset
│   └── Lumpy Skin Images Dataset/
├── artifacts/                       # Training outputs (models, metrics, plots)
├── static/                          # Web app static files (CSS, JS, images)
├── templates/                       # HTML templates
├── logs/                            # Application logs
└── notebooks/                       # Jupyter notebooks (Colab & local)
```

## Key Features

1. **Image-based LSD Detection** — Upload cattle skin image, get instant diagnosis
2. **Confidence Score** — Probability-based prediction with uncertainty handling
3. **Grad-CAM Explainability** — Visual heatmap showing WHY the model detected LSD
4. **Farmer-friendly Output** — Simple result with actionable advice in plain language
5. **Offline Capability** — TFLite model export for mobile/edge deployment
6. **Production Web App** — Flask-based responsive UI for desktop & mobile
7. **Quality Checks** — Image validation before prediction (blur, brightness, size)

## Expected Performance

| Metric | Target | Description |
|--------|--------|-------------|
| Accuracy | > 92% | Overall correct predictions |
| Sensitivity | > 95% | LSD cases correctly identified (critical) |
| Specificity | > 90% | Healthy cattle correctly identified |
| Inference Time | < 2s | Time per prediction on CPU |
| Model Size | < 20 MB | For mobile deployment |

---

## License

MIT License — Free for academic and commercial use.