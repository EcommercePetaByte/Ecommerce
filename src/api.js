import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Asegurate que tu backend corra en este puerto
});

// Interceptor para añadir token JWT a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
