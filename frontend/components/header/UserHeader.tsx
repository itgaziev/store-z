import { useHeaderUser } from "@/store/use-header-store";
import React from "react";

export const UserHeader: React.FC = () => {
    if (!useHeaderUser()) return null;

    return (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200">
                <p className="font-medium text-gray-900">Ivan Ivanov</p>
                <p className="text-sm text-gray-500">ivan@mail.ru</p>
            </div>
            <div className="p-2">
                <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                >Профиль</button>
                <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                >Настройки</button>
                <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-gray-100"
                >Выйти</button>
            </div>
        </div>
    )
}