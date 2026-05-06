export const errorCatch = (error: any): string => {
    const message = error?.response?.data?.message || error?.message || 'An unknown error occurred';
    return message
        ? typeof error.response.data.message === 'object'
        ? message[Object.keys(message)[0]]
        : message
        : 'An unknown error occurred';
}