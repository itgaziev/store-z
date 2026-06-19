import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const formatDate = (isoString: string): string => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    
    // Проверка на валидность даты, чтобы избежать "Invalid Date" на экране
    if (isNaN(date.getTime())) return 'Некорректная дата';

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Moscow' // Укажите нужную таймзону, либо удалите эту строку, чтобы использовать зону пользователя
    }).format(date);
};

export const formatUtcDateDirectly = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Некорректная дата';

    // Используем методы с префиксом UTC, чтобы проигнорировать локальный часовой пояс компьютера
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы в JS идут от 0 до 11
    const year = date.getUTCFullYear();
    
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};