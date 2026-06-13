'use client';
import { Heading } from "@/components/layout/Heading";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface Column {
    id: string;
    title: string;
    width: number | string;
    show: boolean;
    sortable: boolean;
}
interface TableData {
    columns: Column[];
    rows: Record<string, any>[];
}


const demoData: TableData = {
    columns: [
        { id: 'id', title: 'ID', width: 50, show: true, sortable: true },
        { id: 'name', title: 'Name', width: 'auto', show: true, sortable: true },
        { id: 'email', title: 'Email', width: 250, show: true, sortable: true },
        { id: 'role', title: 'Role', width: 150, show: true, sortable: true },
    ],
    rows: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer'
    }))
};

export default function DemoPage() {
    const [multipleSelect, setMultipleSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

    const keyHandler = (event: KeyboardEvent) => {
        if (event.key === 'LCtrl') {
            // Handle Ctrl key press if needed
            // For example, you could set a flag to indicate that the Ctrl key is being held
            setMultipleSelect(true);
        }
    };
    
    const itemClickHandler = (event: React.MouseEvent, itemId: number) => {
        // Отменяем стандартное выделение текста при зажатом Shift
        if (event.shiftKey) {
            event.preventDefault();
        }

        const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

        if (event.shiftKey && lastSelectedId !== null) {
            const start = Math.min(lastSelectedId, itemId);
            const end = Math.max(lastSelectedId, itemId);

            const rangeIds = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            if (isCmdOrCtrl) {
                setSelectedItems((prev) => Array.from(new Set([...prev, ...rangeIds])));
            } else {
                setSelectedItems(rangeIds);
            }
            return;
        }

        if (isCmdOrCtrl) {
            setSelectedItems((prevSelected) => {
                if (prevSelected.includes(itemId)) {
                    return prevSelected.filter((id) => id !== itemId);
                } else {
                    return [...prevSelected, itemId];
                }
            });
        }
        else {
            setSelectedItems([itemId]);
        }

        setLastSelectedId(itemId);
    };

    const itemDoubleClickHandler = (itemId: number) => {
        console.log(`Двойной клик по элементу с ID: ${itemId}`);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <Heading title="Демо" description="Здесь вы можете протестировать компоненты, которые будут использоваться в вашем магазине" />
            { /* Main content goes here */}
            <div className="flex items-center justify-between gap-4 mb-4 bg-white border border-gray-200 p-2 rounded-lg">
                { /* Action buttons go here */}
                <div className="flex flex-2 items-center gap-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Действие 1
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Действие 2
                    </button>
                </div>
                <div className="relative w-full flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск ..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 bg-white border border-gray-200 rounded-lg">
                <div className="flex-1 shrink-0 custom-scrollbar overflow-auto">
                    <table className="w-full select-none">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                                { /* Render column headers based on demoData.columns */}
                                { demoData.columns.map((col) => (
                                    <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: col.width == 'auto' ? 'auto' : `${col.width}px` }}>
                                        {col.title}
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            { /* Render rows based on demoData.rows */}

                            {demoData.rows.map((row) => (
                                <tr key={row.id} className={cn("hover:bg-blue-50 cursor-pointer", {
                                    "bg-blue-100": selectedItems.includes(row.id),
                                })} 
                                onClick={(e) => itemClickHandler(e, row.id)}
                                onDoubleClick={() => itemDoubleClickHandler(row.id)}>
                                    {demoData.columns.map((col) => (
                                        <td key={col.id} className="px-4 py-3 text-xs text-gray-900">
                                            {row[col.id as keyof typeof row]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-100 shrink-0">
                    <p>Содержимое 2</p>
                </div>
            </div>
        </div>
    );
}