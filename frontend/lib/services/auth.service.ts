import { axiosInstance } from "../api/interceptors";
import { IAuthForm, IAuthResponse } from "../types/auth.types";
import { removeFromStorage, setAccessToken } from "./auth-token.service";

export const authService = {
    async main(type: 'login' | 'register', data: IAuthForm) {
        const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
        const response = await axiosInstance.post<IAuthResponse>(endpoint, data);

        if (response.data.accessToken) setAccessToken(response.data.accessToken);
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