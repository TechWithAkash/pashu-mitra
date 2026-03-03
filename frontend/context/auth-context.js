"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const userData = await apiClient.get("/auth/me");
      setUser(userData);
    } catch {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const data = await apiClient.post("/auth/login", { email, password });
    Cookies.set("access_token", data.access_token, { expires: 1 / 48 });
    Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
    const userData = await apiClient.get("/auth/me");
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password, role) => {
    await apiClient.post("/auth/register", { name, email, password, role });
    return login(email, password);
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get("refresh_token");
      await apiClient.post("/auth/logout", {
        refresh_token: refreshToken || undefined,
      });
    } catch {
      // Logout best-effort
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setUser(null);
      router.push("/");
    }
  };

  const updateProfile = async (data) => {
    const updated = await apiClient.patch("/auth/me", data);
    setUser(updated);
    return updated;
  };

  const deleteAccount = async () => {
    await apiClient.delete("/auth/me");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
