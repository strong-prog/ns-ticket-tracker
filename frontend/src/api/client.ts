import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

let authCredentials: string | null = null;

export function setAuthCredentials(username: string, password: string) {
  authCredentials = btoa(`${username}:${password}`);
}

export function clearAuthCredentials() {
  authCredentials = null;
}

export function getAuthCredentials(): string | null {
  return authCredentials;
}

api.interceptors.request.use((config) => {
  if (authCredentials) {
    config.headers.Authorization = `Basic ${authCredentials}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
