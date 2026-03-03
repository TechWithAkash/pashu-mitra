export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const VET_HELPLINE = process.env.NEXT_PUBLIC_VET_HELPLINE || "1962";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PREDICT: "/predict",
  HISTORY: "/history",
  PROFILE: "/profile",
  ADMIN_TRAINING: "/admin/training",
  ADMIN_MODEL: "/admin/model",
};

export const ROLES = {
  FARMER: "farmer",
  VETERINARIAN: "veterinarian",
  ADMIN: "admin",
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
