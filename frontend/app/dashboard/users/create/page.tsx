'use client';

import { Heading } from '@/components/layout/Heading';
import { Input } from '@/components/ui/Input';
import { FilterModal } from '@/components/filter/FilterModal';
import { useInfiniteFilterOptions } from '@/lib/hooks/useInfiniteFilterOptions';
import { useCreateUser } from '@/lib/hooks/useCreateUser';
import { ICreateUserDto } from '@/lib/types/users.types';
import { ArrowLeftIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function CreateUserPage() {
    /* ─── Поля формы ────────────────────────────────────────────── */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [roleId, setRoleId] = useState<string | undefined>(undefined);

    /* ─── Ошибки валидации ──────────────────────────────────────── */
    const [errors, setErrors] = useState<Partial<Record<keyof ICreateUserDto, string>>>({});

    /* ─── Состояние модального окна роли ───────────────────────── */
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    /* ─── Инфинит-загрузка ролей (переиспользуем useInfiniteFilterOptions) */
    const {
        options: roleOptions,
        loading: rolesLoading,
        loadingMore: rolesLoadingMore,
        hasMore: rolesHasMore,
        searchTerm: rolesSearch,
        setSearchTerm: setRolesSearch,
        loadMore: loadMoreRoles,
    } = useInfiniteFilterOptions({
        endpoint: '/users/roles',
        bindLabel: 'name',
        bindValue: 'id',
        enabled: isRoleModalOpen,
    });

    /* ─── Мутация создания пользователя ────────────────────────── */
    const { createUser, isPending, isError, error } = useCreateUser();

    /* ─── Валидация ─────────────────────────────────────────────── */
    function validate(): boolean {
        const next: typeof errors = {};
        if (!email.trim()) next.email = 'Email обязателен';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
            next.email = 'Введите корректный email';
        if (!password) next.password = 'Пароль обязателен';
        else if (password.length < 6) next.password = 'Минимум 6 символов';
        if (!firstName.trim()) next.firstName = 'Имя обязательно';
        if (!lastName.trim()) next.lastName = 'Фамилия обязательна';
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    /* ─── Отправка формы ────────────────────────────────────────── */
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const dto: ICreateUserDto = {
            email: email.trim(),
            password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            patronymic: patronymic.trim() || undefined,
            roleId: roleId || undefined,
        };

        createUser(dto);
    }

    /* ─── Текст ошибки мутации ─────────────────────────────────── */
    const mutationErrorMsg = isError
        ? ((error as any)?.response?.data?.message ?? 'Ошибка при создании пользователя')
        : null;

    return (
        <div className="w-full">
            <Heading
                title="Создание пользователя"
                description="Заполните все обязательные поля и нажмите «Сохранить»."
            />

            {/* Кнопка назад */}
            <Link
                href="/dashboard/users"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Вернуться к списку
            </Link>

            <form onSubmit={handleSubmit} noValidate>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">

                    {/* Глобальная ошибка мутации */}
                    {mutationErrorMsg && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
                            {Array.isArray(mutationErrorMsg)
                                ? mutationErrorMsg.join(', ')
                                : mutationErrorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            id="create-user-firstName"
                            label="Имя *"
                            placeholder="Иван"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            error={errors.firstName}
                        />
                        <Input
                            id="create-user-lastName"
                            label="Фамилия *"
                            placeholder="Иванов"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            error={errors.lastName}
                        />
                    </div>

                    <Input
                        id="create-user-patronymic"
                        label="Отчество"
                        placeholder="Иванович"
                        value={patronymic}
                        onChange={e => setPatronymic(e.target.value)}
                    />

                    <Input
                        id="create-user-email"
                        type="email"
                        label="Email *"
                        placeholder="user@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <Input
                        id="create-user-password"
                        type="password"
                        label="Пароль * (минимум 6 символов)"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    {/* Поле роли через FilterModal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Роль
                        </label>
                        <FilterModal
                            title="Выбор роли"
                            placeholder="Нажмите для выбора роли..."
                            value={roleId}
                            onChange={setRoleId}
                            options={roleOptions}
                            loading={rolesLoading}
                            loadingMore={rolesLoadingMore}
                            hasMore={rolesHasMore}
                            searchTerm={rolesSearch}
                            onSearchChange={setRolesSearch}
                            onLoadMore={loadMoreRoles}
                            isOpen={isRoleModalOpen}
                            onOpenChange={setIsRoleModalOpen}
                        />
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center justify-end gap-3 mt-4">
                    <Link
                        href="/dashboard/users"
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Отмена
                    </Link>
                    <button
                        id="create-user-submit"
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending
                            ? <Loader2Icon className="w-4 h-4 animate-spin" />
                            : <SaveIcon className="w-4 h-4" />}
                        {isPending ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
}
