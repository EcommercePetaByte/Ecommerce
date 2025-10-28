import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Asegúrate que esta URL sea correcta
});

// CORRECCIÓN: Interceptor para añadir el token a cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;