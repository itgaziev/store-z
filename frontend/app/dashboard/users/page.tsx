'use client';

import { Heading } from "@/components/layout/Heading";
import { SearchTable } from "@/components/tables/SearchTable";
import { userService } from "@/lib/services/users.services";
import { IPaginatedResponse } from "@/lib/types/paginates.types";
import { IUserResponse } from "@/lib/types/users.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Table } from "@/components/tables/Table";
import { useState } from "react";

const columns: { key: string; label: string; isSortable?: boolean }[] = [
    { key: 'email', label: 'Email', isSortable: true },
    { key: 'firstName', label: 'Имя', isSortable: true },
    { key: 'lastName', label: 'Фамилия', isSortable: true },
];

type SortDirection = 'ASC' | 'DESC';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('email');
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

    const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['users', searchTerm, sortBy, sortDirection],
        queryFn: async ({ pageParam = 1}) => userService.getAll(pageParam, 10, sortBy, sortDirection, searchTerm),
        getNextPageParam: (lastPage: IPaginatedResponse<IUserResponse>) => {
            const { page, total, limit } = lastPage;
            return page < Math.ceil(total / limit) ? page + 1 : undefined;
        }, 
        initialPageParam: 1,
    });

    const flatUsers = data?.pages.flatMap(page => page.data) || [];

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleSort = (key: string, direction: SortDirection) => {
        setSortBy(key);
        setSortDirection(direction);
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <Heading title="Пользователи" description="Управление пользователями вашего магазина" />
            { /* Main content goes here */ }
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shrink-0">
                        <SearchTable onSearch={handleSearch} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
                        <div className="overflow-auto flex-1 custom-scrollbar">
                            <Table
                                columns={columns}
                                data={flatUsers}
                                isLoading={isLoading}
                                hasMore={hasNextPage}
                                onLoadMore={fetchNextPage}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}