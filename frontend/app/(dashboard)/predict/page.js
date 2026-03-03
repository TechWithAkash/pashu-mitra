"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import ImageDropzone from "@/components/predict/image-dropzone";
import PredictionResult from "@/components/predict/prediction-result";
import GradcamViewer from "@/components/predict/gradcam-viewer";
import PhotoTips from "@/components/predict/photo-tips";
import PostDiagnosisActions from "@/components/predict/post-diagnosis-actions";

export default function PredictPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setGradcam(null);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleCheck = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    setGradcam(null);

    try {
      const data = await apiClient.upload("/predict/gradcam", file);
      setResult(data);
      if (data.gradcam_image) {
        setGradcam(data.gradcam_image);
      }
      toast.success(t("predict.analysisComplete"));
    } catch (err) {
      toast.error(err.message || t("predict.analysisFailed"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-4xl space-y-8"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("predict.title")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("predict.subtitle")}
        </p>
      </div>

      <PhotoTips />

      <ImageDropzone
        onFileSelect={handleFileSelect}
        onAnalyze={handleCheck}
        disabled={isAnalyzing}
        isAnalyzing={isAnalyzing}
      />

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-6"
          >
            <PredictionResult result={result} />
            {gradcam && previewUrl && (
              <GradcamViewer originalUrl={previewUrl} gradcamBase64={gradcam} />
            )}
            <PostDiagnosisActions result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
