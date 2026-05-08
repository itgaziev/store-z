'use client';

import { cn } from "@/lib/utils";
import { ArrowDownAz, ArrowUpAz, LoaderPinwheel } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Column {
    key: string;
    label: string;
    isSortable?: boolean;
}

type SortDirection = 'ASC' | 'DESC';

interface TableProps {
    columns: Column[];
    data: any[];
    hasActions?: boolean;
    selectItemAction?: (item: any) => void;
    isLoading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    sortBy?: string;
    sortDirection?: SortDirection;
    onSort?: (key: string, direction: SortDirection) => void;
}

export const Table: React.FC<TableProps> = ({
        columns,
        data,
        hasActions,
        selectItemAction,
        isLoading,
        hasMore,
        onLoadMore,
        sortBy,
        sortDirection: initialSortDirection,
        onSort
    }) => {

    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const currentSortKey = sortBy;


    const handleSort = (column: Column) => {
        if (!column.isSortable) return;
        const newDirection: SortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
        setSortDirection(newDirection);
        if (onSort) {
            onSort(column.key, newDirection);
        }
    }

    const renderSortIcon = (column: Column) => {
        if (!column.isSortable) return null;
        if (currentSortKey !== column.key) {
            return <ArrowUpAz className="w-4 h-4 text-gray-400" />;
        }

        return sortDirection === 'ASC' ? (
            <ArrowUpAz className="w-4 h-4 text-gray-700" />
        ) : (
            <ArrowDownAz className="w-4 h-4 text-gray-700" />
        );
    }


    const selectRow = (row: any) => {
        setSelectedRow(row);
        if (selectItemAction) {
            selectItemAction(row);
        }
    }

    useEffect(() => {
        if (!hasMore || isLoading || !onLoadMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                onLoadMore();
            }
        }, { rootMargin: '100px' });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                    {hasActions && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Действия</th>}
                    {columns.map(column => (
                        <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {column.isSortable ? (
                                <button onClick={() => handleSort(column)} className="flex items-center gap-1 hover:text-gray-700">
                                    {column.label} {column.isSortable && renderSortIcon(column)}
                                </button>
                            ) : (
                                <span>{column.label}</span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                    <tr key={index}
                        onClick={() => selectRow(row)}
                        className={cn(
                            'cursor-pointer transition-colors duration-200',
                            selectedRow === row ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        )}
                    >
                        {hasActions && (
                            <td className="px-4 py-3">
                                <div className="flex gap-1">{ /* Action buttons */}</div>
                            </td>
                        )}

                        {columns.map(column => row[column.key] !== undefined && (
                            <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                                {row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={columns.length + (hasActions ? 1 : 0)} className="p-4">
                        <div ref={loadMoreRef} className="flex justify-center">
                            {isLoading && (
                                <LoaderPinwheel className="w-6 animate-spin" />
                            )}
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}