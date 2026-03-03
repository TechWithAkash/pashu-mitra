"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { useLanguage } from "@/context/language-context";

export default function ImageDropzone({ onFileSelect, onAnalyze, disabled, isAnalyzing }) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError("");
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        if (err.code === "file-too-large") {
          setError(t("predict.fileTooLarge"));
        } else if (err.code === "file-invalid-type") {
          setError(t("predict.invalidType"));
        } else {
          setError(err.message);
        }
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setPreview(url);
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect, t]
  );

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError("");
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled,
  });

  if (file && preview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-5"
      >
        {/* Preview card */}
        <div className="relative rounded-2xl overflow-hidden bg-muted/20 shadow-premium border border-border/60">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-80 object-contain"
          />

          {/* Gradient overlay at top for the close button */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          <motion.button
            onClick={clearFile}
            disabled={disabled}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm hover:bg-background hover:shadow-md transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* File info */}
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground px-1">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted/60">
            <ImageIcon className="h-4 w-4" />
          </div>
          <span className="truncate font-medium">{file.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground/60">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={onAnalyze}
            disabled={disabled || isAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold
                       hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
          >
            {isAnalyzing ? (
              <motion.div
                className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isAnalyzing ? t("predict.analyzing") : t("predict.analyzeButton")}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-colors duration-200
          ${isDragActive
            ? "border-primary bg-primary/[0.04]"
            : "border-border/70 hover:border-primary/40 hover:bg-muted/20"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        whileHover={disabled ? {} : { scale: 1.005 }}
        whileTap={disabled ? {} : { scale: 0.995 }}
        animate={isDragActive ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <motion.div
            className={`p-4 rounded-2xl transition-colors duration-200 ${
              isDragActive ? "bg-primary/10" : "bg-muted/50"
            }`}
            animate={isDragActive ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Upload
              className={`h-8 w-8 transition-colors duration-200 ${
                isDragActive ? "text-primary" : "text-muted-foreground/60"
              }`}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {isDragActive ? (
              <motion.div
                key="drag"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-primary font-semibold text-base">
                  {t("predict.dropHere")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5"
              >
                <p className="font-semibold text-foreground/80 text-base">
                  {t("predict.dropzoneTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("predict.dropzoneSubtitle")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-destructive px-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
