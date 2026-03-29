import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Axios instance for Handora buyer account APIs.
 * Sends Bearer token from localStorage on every request.
 */
const userApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchUserProfile() {
  const { data } = await userApi.get("/api/users/profile");
  return data;
}

export async function fetchUserDashboard() {
  const { data } = await userApi.get("/api/users/dashboard");
  return data;
}

export async function updateUserProfile(body) {
  const { data } = await userApi.put("/api/users/profile", body);
  return data;
}

export default userApi;
