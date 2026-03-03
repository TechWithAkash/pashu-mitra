"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export function usePredictions() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchPredictions = useCallback(async (reset = false) => {
    const skip = reset ? 0 : page * limit;
    setIsLoading(true);
    try {
      const data = await apiClient.get(`/predictions?skip=${skip}&limit=${limit}`);
      if (reset) {
        setPredictions(data);
        setPage(1);
      } else {
        setPredictions((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }
      setHasMore(data.length === limit);
    } catch {
      if (reset) setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const deletePrediction = async (id) => {
    await apiClient.delete(`/predictions/${id}`);
    setPredictions((prev) => prev.filter((p) => p.id !== id));
  };

  return { predictions, isLoading, hasMore, fetchPredictions, deletePrediction };
}
