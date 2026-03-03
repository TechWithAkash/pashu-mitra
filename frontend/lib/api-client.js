import Cookies from "js-cookie";
import { API_BASE_URL } from "./constants";

let refreshPromise = null;

async function refreshTokens() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      throw new Error("Refresh failed");
    }

    const data = await res.json();
    Cookies.set("access_token", data.access_token, { expires: 1 / 48 }); // ~30 min
    Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
    return data.access_token;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function request(method, path, { body, headers: extraHeaders, isFormData } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { ...extraHeaders };
  const accessToken = Cookies.get("access_token");

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = { method, headers };
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  let res = await fetch(url, config);

  // Auto-refresh on 401
  if (res.status === 401 && accessToken) {
    try {
      const newToken = await refreshTokens();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...config, headers });
    } catch {
      // Refresh failed — caller handles 401
    }
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.detail || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, body, opts) => request("POST", path, { body, ...opts }),
  patch: (path, body, opts) => request("PATCH", path, { body, ...opts }),
  delete: (path, opts) => request("DELETE", path, opts),

  upload: (path, file, fieldName = "file") => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return request("POST", path, { body: formData, isFormData: true });
  },
};
