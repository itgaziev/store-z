import axios, { type CreateAxiosDefaults } from "axios";
import { getAccessToken, removeFromStorage } from "../services/auth-token.service";
import { errorCatch } from "./error";
import { authService } from "../services/auth.service";

const options: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
};

const axiosInstance = axios.create(options);
const axiosWithAuth = axios.create(options);

axiosWithAuth.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

axiosWithAuth.interceptors.response.use(
    config => config,
    async (error) => {
        const originalRequest = error.config;

        // Проверяем на 401 ошибку и следим, чтобы это не был повторный запрос
        if (
            (error?.response?.status === 401 || 
             errorCatch(error) === 'jwt expired' || 
             errorCatch(error) === 'jwt must be provided') &&
            originalRequest && !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;

            try {
                // Пытаемся обновить accessToken
                await authService.getNewAccessToken();
                
                // КРИТИЧЕСКИЙ МОМЕНТ: Повторяем запрос с новым токеном
                return axiosWithAuth.request(originalRequest);
            } catch (err) {
                // Если даже refresh упал (например, refreshToken в куках тоже протух)
                if (errorCatch(err) === 'jwt expired' || errorCatch(err) === 'jwt must be provided') {
                    removeFromStorage();
                    // Здесь можно сделать window.location.href = '/login'
                }
            }
        }
        
        // Если это не 401 или все попытки провалены — прокидываем ошибку в catch вызывающего кода
        return Promise.reject(error); 
    }
);


export { axiosInstance, axiosWithAuth };