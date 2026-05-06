import axios, { type CreateAxiosDefaults } from "axios";
import { getAccessToken, removeFromStorage } from "../services/auth-token.service";
import { errorCatch } from "./error";
import { authService } from "../services/auth.service";

const options: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
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
        if (error?.response?.status === 401 
            || errorCatch(error) === 'jwt expired'
            || errorCatch(error) === 'jwt must be provided' && error.config && !error.config._isRetry) {
                originalRequest._isRetry = true;
                try {
                    await authService.getNewAccessToken();
                }
                catch (err) {
                    if (errorCatch(err) === 'jwt expired' || errorCatch(err) === 'jwt must be provided') {
                        removeFromStorage();
                    }
                }
        }
        
        throw error;
    }
);


export { axiosInstance, axiosWithAuth };