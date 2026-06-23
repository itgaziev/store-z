'use client';

import { IFilterTableOption } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";
import { LoaderPinwheel, Search, X } from "lucide-react";
import { useState } from "react";

interface FilterModalProps {
    title: string;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    options: IFilterTableOption[];
    loading: boolean;
    onOpen: () => void;
}

export const FilterModal = (
    {
        title,
        value,
        onChange,
        placeholder,
        options,
        loading,
        onOpen }
        : FilterModalProps
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpen = () => {
        setIsOpen(true);
        onOpen();
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="w-full">
            <div
                onClick={handleOpen}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors truncate flex justify-between items-center"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : (placeholder || "Выбрать из списка")}
                </span>
                <Search className="w-3 h-3 text-gray-400 shrink-0" />
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-100">

                        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-lg">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-2 border-b border-gray-100 bg-white">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск в списке ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded pl-8 pr-3 py-2 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar bg-white rounded-b-lg">
                            {loading ? (
                                <div className="flex justify-center p-6">
                                    <LoaderPinwheel className="w-6 h-6 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                options
                                    .filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                'p-2 text-xs rounded cursor-pointer transition-colors',
                                                value === opt.value ?
                                                    'bg-blue-100 text-blue-700 font-medium'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            )}
                                        >
                                            {opt.label}
                                        </div>
                                    ))
                            )}
                            {!loading && options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <p className="text-center text-xs text-gray-400 py-4">Ничего не найдено</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}