import { LOGIN_ROUTE } from "@/lib/constants/routes-name";
import { authService } from "@/lib/services/auth.service";
import { useHeaderUser } from "@/store/use-header-store";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const UserHeader: React.FC = () => {
    const { push } = useRouter();
    const { user, fetchUser, isLoading, clearUser } = useUserStore();
    const logout = async () => {
        await authService.logout(); 
        clearUser(); // Очищаем данные пользователя из Zustand 
        push(LOGIN_ROUTE);
    };

    if (!useHeaderUser()) return null;


    return (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="p-2">
                <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                >Профиль</button>
                <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                >Настройки</button>
                <button onClick={() => logout() }
                    className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-gray-100"
                >Выйти</button>
            </div>
        </div>
    )
}