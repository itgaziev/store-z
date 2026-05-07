import { axiosInstance } from "../api/interceptors";
import { IAuthForm, IAuthResponse, IRegisterForm } from "../types/auth.types";
import { removeFromStorage, setAccessToken } from "./auth-token.service";

export const authService = {
    async login(data: IAuthForm) {
        const endpoint = '/auth/login';
        const response = await axiosInstance.post<IAuthResponse>(endpoint, data);
        console.log('Auth response:', response.data);
        if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response;
    },

    async register(data: IRegisterForm) {
        const endpoint = '/auth/register';
        const { confirmPassword, ...requestData } = data;
        const response = await axiosInstance.post<IAuthResponse>(endpoint, requestData);
        //if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response;
    },

    async getNewAccessToken() {
        const response = await axiosInstance.post<IAuthResponse>('/auth/refresh');
        if (response.data.accessToken) setAccessToken(response.data.accessToken);
        return response;
    },

    async logout() {
        const response = await axiosInstance.post('/auth/logout');
        if (response.data) {
            removeFromStorage();
        }

        return response;
    }
}