'use client';
import { Heading } from "@/components/layout/Heading";
import { StoreTable } from "@/components/tables/StoreTable";
import { userService } from "@/lib/services/users.services";
import { IPaginatedResponse } from "@/lib/types/paginates.types";
import { SortDirection, TableData } from "@/lib/types/table.types";
import { IUserColumn, IUserResponse, IUserTableRow, UserColumns } from "@/lib/types/users.types";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";


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
    const [columns, setColumns] = useState<IUserColumn[]>(UserColumns);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['users', searchTerm, sortBy, sortDirection],
        queryFn: async ({ pageParam = 1 }) => userService.getAllRow(pageParam, 40, sortBy, sortDirection, searchTerm),
        getNextPageParam: (lastPage: IPaginatedResponse<IUserTableRow>) => {
            const { page, total, limit } = lastPage;
            return page < Math.ceil(total / limit) ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const flatUsers = data?.pages.flatMap(page => page.data) || [];

    const onSelectRow = (indexs: number[]) => {
        demoData.rows.map((row: Record<string, any>, i: number) => {
            if (indexs.includes(i)) {
                console.log(row);
            }
        })
    }
    useEffect(() => {
        if (data) {
            const flatUsersD = data?.pages.flatMap(page => page.data) || [];
            console.log(flatUsersD);
        }
    }, [data])
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 bg-white border border-gray-200 rounded-lg overflow-hidden" >

                <div className="flex-1 min-w-0 overflow-x-auto custom-scrollbar">
                    <StoreTable
                        isMulti={true}
                        rows={flatUsers}
                        columns={columns}
                        onSelect={onSelectRow}
                    />
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ (Содержимое 2) */}
                <div className="w-80 shrink-0 border-l border-gray-200 p-4 bg-gray-50/50">
                    <p className="font-medium text-gray-700">Содержимое 2</p>
                </div>
            </div>
        </div>
    );
}