import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Simulates network latency for mock responses. This is the only
 * place in the app that "knows" the backend is mocked — swap the
 * call sites in `chatService` over to `apiClient` once a real API exists.
 */
export function mockDelay<T>(data: T, ms = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);