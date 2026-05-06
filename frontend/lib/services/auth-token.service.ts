import Cookies from 'js-cookie';

export enum EnumTokens {
    ACCESS_TOKEN = 'accessToken',
    REFRESH_TOKEN = 'refreshToken',
}

export const getAccessToken = (): string | null => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
    return accessToken || null;
}

export const setAccessToken = (accessToken: string, expires: number = 1): void => {
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, { expires: expires / (24 * 60 * 60) });
}

export const removeFromStorage = (): void => {
    Cookies.remove(EnumTokens.ACCESS_TOKEN);
}