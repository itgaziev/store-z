import { Actions } from "@/data/actions";
import React from "react";

export const Action: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 gap-3">
                {Actions.map(item => (
                    <button
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => item.action}
                        key={item.title}
                    >
                        <div className={`w-10 h-10 bg-${item.colorName}-100 rounded-lg flex items-center justify-center`}>
                            <svg
                                className={`w-5 h-5 text-${item.colorName}-600`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{ item.title }</span>
                    </button>
                ))}
            </div>
        </div>
    )
}