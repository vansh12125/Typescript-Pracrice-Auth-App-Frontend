import { apiClient } from "@/config";
import { logout } from "@/redux";
import { refreshAccessToken } from "./refreshManager";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

export const axiosRequestInterceptor = () => {
  apiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );
};

export const axiosResponseInterceptor = (store) => {
  apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const authEndpoints = [
        "/auth/signin",
        "/auth/signup",
        "/auth/refresh",
        "/auth/signout",
        "/auth/signout/all",
        "/auth/google",
        "/auth/google/callback",
        "/auth/link/google",
      ];

      if (
        authEndpoints.some((url) =>
          originalRequest.url?.startsWith(url),
        )
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await refreshAccessToken();

        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());

        return Promise.reject(refreshError);
      }
    },
  );
};