'use client';

import { IFilterTableOption } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";
import { LoaderPinwheel, Search, X } from "lucide-react";
import { useRef } from "react";

interface FilterModalProps {
    title: string;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    /** Текущая страница опций (накапливается при infinite scroll) */
    options: IFilterTableOption[];
    /** Идёт ли первоначальная загрузка страницы */
    loading: boolean;
    /** Идёт ли подгрузка следующей страницы */
    loadingMore: boolean;
    /** Есть ли ещё страницы для подгрузки */
    hasMore: boolean;
    /** Текущее значение поиска (управляется снаружи через хук) */
    searchTerm: string;
    /** Обновить поисковый запрос (debounce внутри хука) */
    onSearchChange: (value: string) => void;
    /** Подгрузить следующую страницу */
    onLoadMore: () => void;
    /** Контролируемое состояние открытости */
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const FilterModal = ({
    title,
    value,
    onChange,
    placeholder,
    options,
    loading,
    loadingMore,
    hasMore,
    searchTerm,
    onSearchChange,
    onLoadMore,
    isOpen,
    onOpenChange,
}: FilterModalProps) => {
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    /** Определяем момент приближения к концу списка (порог 80px) */
    const handleScroll = () => {
        const el = listRef.current;
        if (!el || loading || loadingMore || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
            onLoadMore();
        }
    };

    return (
        <div className="w-full">
            {/* Триггер */}
            <div
                onClick={() => onOpenChange(true)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors truncate flex justify-between items-center"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : (placeholder || "Выбрать из списка")}
                </span>
                <Search className="w-3 h-3 text-gray-400 shrink-0" />
            </div>

            {/* Модальное окно */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-100">

                        {/* Заголовок */}
                        <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-lg">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Поиск — значение контролируется хуком, debounce внутри */}
                        <div className="p-2 border-b border-gray-100 bg-white">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск в списке ..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded pl-8 pr-3 py-2 outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Список с отслеживанием скролла */}
                        <div
                            ref={listRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar bg-white rounded-b-lg"
                        >
                            {/* Первичный оверлей загрузки */}
                            {loading ? (
                                <div className="flex justify-center p-6">
                                    <LoaderPinwheel className="w-6 h-6 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <>
                                    {options.map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => {
                                                onChange(opt.value);
                                                onOpenChange(false);
                                            }}
                                            className={cn(
                                                'p-2 text-xs rounded cursor-pointer transition-colors',
                                                value === opt.value
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            )}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}

                                    {/* Пустое состояние */}
                                    {!loadingMore && options.length === 0 && (
                                        <p className="text-center text-xs text-gray-400 py-4">Ничего не найдено</p>
                                    )}

                                    {/* Спиннер дозагрузки страниц */}
                                    {loadingMore && (
                                        <div className="flex justify-center py-3">
                                            <LoaderPinwheel className="w-4 h-4 animate-spin text-blue-400" />
                                        </div>
                                    )}

                                    {/* Конец списка */}
                                    {!hasMore && options.length > 0 && (
                                        <p className="text-center text-[10px] text-gray-300 py-2">Все записи загружены</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};