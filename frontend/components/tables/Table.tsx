import { cn } from "@/lib/utils";
import { ArrowDownAz, ArrowUpAz } from "lucide-react";
import { useState } from "react";

interface Column {
    key: string;
    label: string;
    isSortable?: boolean;
}

interface TableProps {
    columns: Column[];
    data: any[];
    hasActions?: boolean;
    selectItemAction?: (item: any) => void;
}

type SortDirection = 'asc' | 'desc';

export const Table = ({ columns, data, hasActions, selectItemAction }: TableProps) => {
    const [sortBy, setSortBy] = useState<Column | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const renderSortIcon = (column: Column) => {
        if (!column.isSortable) return null;
        if (sortBy?.key !== column.key) {
            return <ArrowUpAz className="w-4 h-4 text-gray-400" />;
        }

        return sortDirection === 'asc' ? (
            <ArrowUpAz className="w-4 h-4 text-gray-700" />
        ) : (
            <ArrowDownAz className="w-4 h-4 text-gray-700" />
        );
    }

    const handleSort = (column: Column) => {
        if (!column.isSortable) return;

        if (sortBy?.key === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    }

    const selectRow = (row: any) => {
        setSelectedRow(row);
        if (selectItemAction) {
            selectItemAction(row);
        }
    }

    return (
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                    {hasActions && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Действия</th>}
                    {columns.map(column => (
                        <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            { column.isSortable ? (
                                <button onClick={() => handleSort(column)} className="flex items-center gap-1 hover:text-gray-700">
                                    { column.label } { column.isSortable && renderSortIcon(column) }
                                </button>
                            ) : (
                                <span>{ column.label }</span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                { data.map((row, index) => (
                    <tr key={index}
                        onClick={() => selectRow(row)}
                        className={cn(
                            'cursor-pointer transition-colors duration-200',
                            selectedRow === row ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        )}
                    >
                        {hasActions && (
                            <td className="px-4 py-3">
                                <div className="flex gap-1">{ /* Action buttons */ }</div>
                            </td>
                        )}

                        {columns.map(column => row[column.key] !== undefined && (
                            <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                                { row[column.key] }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}