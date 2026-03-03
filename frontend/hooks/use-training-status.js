"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";

export function useTrainingStatus() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await apiClient.get("/train/status");
      setStatus(data);
      return data;
    } catch {
      // Might not have training status yet
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startTraining = async () => {
    const data = await apiClient.post("/train");
    // Start polling
    startPolling();
    return data;
  };

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const data = await fetchStatus();
      if (data && (data.status === "completed" || data.status === "error" || data.status === "idle")) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 3000);
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus().then((data) => {
      if (data?.status === "training") {
        startPolling();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { status, isLoading, startTraining, refreshStatus: fetchStatus };
}
