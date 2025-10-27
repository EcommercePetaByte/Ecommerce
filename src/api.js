import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // tu backend
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
