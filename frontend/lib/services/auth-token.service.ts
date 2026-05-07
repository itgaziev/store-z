import Cookies from 'js-cookie';
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants/cookies-name';

export const getAccessToken = (): string | null => {
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
    return accessToken || null;
}

export const setAccessToken = (accessToken: string, expires: number = 1): void => {
    Cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, { 
        domain: 'localhost',
        sameSite: 'strict',
        expires: expires
    });
}

export const removeFromStorage = (): void => {
    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
}