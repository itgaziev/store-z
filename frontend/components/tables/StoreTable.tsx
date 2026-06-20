'use client';

import { Column, SortDirection, TableData } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowUpAZ, LoaderPinwheel, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
type StoreTableProps = {
    isMulti: boolean;
    columns: Column[];
    rows: any[];
    onSelect?: (indexs: number[]) => void

    // Infinity scroll
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    status: 'pending' | 'error' | 'success';
    fetchNextPage: () => void;

    // Sortable
    sortBy?: string;
    sortDirection?: SortDirection;
    onSort?: (key: string, direction: SortDirection) => void;
}

export const StoreTable = (props: StoreTableProps) => {
    const { columns, rows, onSelect } = props;
    const { hasNextPage, isFetchingNextPage, status, fetchNextPage } = props;

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);
    
    const { sortBy, sortDirection : initialSortDirection, onSort } = props;
    const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection || 'DESC')

    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const singleClickHandler = (event: React.MouseEvent, index: number, row: any) => {
        if (event.shiftKey) {
            event.preventDefault();
        }

        const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

        // Переменная, в которую мы запишем итоговый массив выбранных индексов
        let nextSelected: number[] = [];

        if (event.shiftKey && lastSelectedId !== null && props.isMulti) {
            const start = Math.min(lastSelectedId, index);
            const end = Math.max(lastSelectedId, index);
            const rangeIds = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            if (isCmdOrCtrl) {
                // Поскольку нам нужен чистый массив прямо сейчас, берем текущий selectedItems
                nextSelected = Array.from(new Set([...selectedItems, ...rangeIds]));
            } else {
                nextSelected = rangeIds;
            }
        } else if (isCmdOrCtrl && props.isMulti) {
            if (selectedItems.includes(index)) {
                nextSelected = selectedItems.filter(id => id !== index);
            } else {
                nextSelected = [...selectedItems, index];
            }
        } else {
            nextSelected = [index];
        }

        // 1. Обновляем локальный стейт для визуала (подсветка строк tr)
        setSelectedItems(nextSelected);
        setLastSelectedId(index);

        // 2. Сразу же отдаем родителю актуальный массив, гарантируя отсутствие рассинхронизации
        if (onSelect) {
            onSelect(nextSelected);
        }
    }

    const doubleClickHandler = (event: React.MouseEvent, row: any) => {
        console.log(`Двойной клик по элементу с ID: ${row}`);
    }

    const renderFooterContent = () => {
        if (status === 'error') {
            return (
                <div className="flex flex-col items-center gap-2 py-2">
                    <p className="text-sm text-red-500 font-medium">Ошибка при загрузке данных</p>
                    <button
                        onClick={() => fetchNextPage()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Повторить загрузку
                    </button>
                </div>
            )
        }

        if (isFetchingNextPage || (status === 'pending' && rows.length === 0)) {
            return (
                <div className="flex justify-center py-2">
                    <LoaderPinwheel className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
            )
        }

        if (!hasNextPage && rows.length > 0) {
            return (
                <p className="text-center text-xs text-gray-400 font-medium py-2">Данные полностью загружены</p>
            )
        }

        return null;
    }

    const handleSort = (column: Column) => {
        if (!column.sortable) return;
        const newDir: SortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
        setSortDirection(newDir);

        if (onSort) {
            onSort(column.id, newDir);
        }
    }

    const renderSortIcon = (column: Column) => {
        if (!column.sortable) return null;

        if (sortBy !== column.id) {
            return <ArrowUpAZ className="w-4 h-4 text-gray-400" />
        }

        return sortDirection === 'ASC' ? (
            <ArrowUpAZ className="w-4 h-4 text-gray-700" />
        ) : (
            <ArrowDownAZ className="w-4 h-4 text-gray-700" />
        );

    }

    useEffect(() => {
        const observerTarget = loadMoreRef.current;
        if (!observerTarget || !hasNextPage || isFetchingNextPage || status === 'error') return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(observerTarget);

        return () => {
            observer.unobserve(observerTarget);
        }
    }, [hasNextPage, isFetchingNextPage, status, fetchNextPage]);


    return (
        <table className="min-w-full table-fixed select-none divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                    {columns.filter(c => c.show).map(col => {
                        const isAuto = col.width === 'auto';
                        const widthStyle = isAuto
                            ? { width: 'auto' }
                            : { width: `${col.width}px`, minWidth: `${col.width}px` };
                        return (
                            <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={widthStyle}>
                                {col.sortable ? (
                                    <button
                                        onClick={() => handleSort(col)}
                                        className="flex items-center gap-1 hover:text-gray-700"
                                    >
                                        {col.title} {renderSortIcon(col)}
                                    </button>
                                ) : (
                                    <span>{col.title}</span>
                                )}
                                {/* Сюда можно добавить UI для изменения ширины (resizable) */}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {
                    rows.length === 0 && status !== 'pending' ? (
                        <tr>
                            <td
                                colSpan={columns.filter(c => c.show).length}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                Нет элементов
                            </td>
                        </tr>
                    ) : (
                        rows.map((row: Record<string, any>, i: number) => {

                            return (
                                <tr
                                    key={i}
                                    className={cn("hover:bg-blue-50 cursor-pointer", {
                                        "bg-blue-100": selectedItems.includes(i),
                                    })}
                                    onClick={(e) => singleClickHandler(e, i, row)}
                                    onDoubleClick={(e) => doubleClickHandler(e, row)}
                                >
                                    {columns.filter(c => c.show).map(col => (
                                        <td
                                            key={col.id}
                                            className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap truncate"
                                            style={{ width: col.width == 'auto' ? 'auto' : `${col.width}px` }}
                                        >
                                            {row[col.id]}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })
                    )
                }
            </tbody>
            {(rows.length > 0 || status === 'pending' || status === 'error') && (
                <tfoot className="bg-gray-50/50 border-t border-gray-100">
                    <tr>
                        <td colSpan={columns.filter(c => c.show).length} className="p-3">
                            <div ref={loadMoreRef}>
                                {renderFooterContent()}
                            </div>
                        </td>
                    </tr>
                </tfoot>
            )}
        </table>
    );
}