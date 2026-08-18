import { apiClient } from "@/config";

let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};