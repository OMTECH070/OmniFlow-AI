import axios, { type AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/mock";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[api] request failed:", error?.message ?? error);
    }
    return Promise.reject(error);
  }
);

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function jitteredDelay<T>(value: T, min = 500, max = 1400): Promise<T> {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return delay(value, ms);
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}