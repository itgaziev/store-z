export const errorCatch = (error: any): string => {
    const response = error?.response?.data;
    const message = response?.message || error?.message || 'An unknown error occurred';

    if (Array.isArray(message)) return message[0]; // Если пришел массив ошибок валидации
    if (typeof message === 'object') return message[Object.keys(message)[0]];
    
    return message;
}