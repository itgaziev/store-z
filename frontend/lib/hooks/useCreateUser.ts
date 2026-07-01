'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/services/users.services';
import { ICreateUserDto } from '@/lib/types/users.types';

/**
 * Хук создания пользователя.
 * Инкапсулирует мутацию POST /users и редирект после успеха.
 */
export function useCreateUser() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending, error, isError } = useMutation({
        mutationFn: (dto: ICreateUserDto) => userService.create(dto),
        onSuccess: () => {
            // Инвалидируем кэш списка пользователей, чтобы таблица обновилась
            queryClient.invalidateQueries({ queryKey: ['users'] });
            router.push('/dashboard/users');
        },
    });

    return {
        createUser: mutate,
        isPending,
        isError,
        error,
    };
}
