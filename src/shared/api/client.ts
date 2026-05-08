import axios from "axios";
import { useAuthStore } from "../store/auth";

// Since we don't have a real API, we use a placeholder or local mock behavior
export const apiClient = axios.create({
  baseURL: "/api", // Using a prefix for relative API calls
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
