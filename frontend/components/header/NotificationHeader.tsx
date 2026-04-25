import { notifications } from "@/data/notifications";
import { useHeaderNotification } from "@/store/use-header-store";
import React from "react";

export const NotificationHeader: React.FC = () => {
    if (!useHeaderNotification()) return null;

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Оповещения</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.map(item => (
                    <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-900">{item.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                    Показать все
                </button>
            </div>
        </div>
    );
}