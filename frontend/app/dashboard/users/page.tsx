'use client';
import { Heading } from "@/components/layout/Heading";
import { TableSidebar } from "@/components/tables/TableSidebar";
import { StoreTable } from "@/components/tables/StoreTable";
import { userService } from "@/lib/services/users.services";
import { IPaginatedResponse } from "@/lib/types/paginates.types";
import { IFilterItem, SortDirection } from "@/lib/types/table.types";
import { IUserColumn, IUserTableRow, UserColumns, UserFilterConfig } from "@/lib/types/users.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { TreeNodeData } from "@/lib/types/inerfaces";
import { DEMO_TREE } from "@/data/demo";


export default function UsersPage() {
    const [columns] = useState<IUserColumn[]>(UserColumns);
    const [treeData] = useState<TreeNodeData[]>(DEMO_TREE);

    // Глобальный поиск (по нескольким полям через OR на бэкенде)
    const [searchTerm, setSearchTerm] = useState('');

    // Сортировка
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

    // Полевые фильтры из боковой панели (AND-логика на бэкенде)
    const [filters, setFilters] = useState<IFilterItem[]>([]);

    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['users', searchTerm, sortBy, sortDirection, filters],
        queryFn: async ({ pageParam = 1 }) =>
            userService.findAllByBody({
                page: pageParam,
                limit: 10,
                sort: sortBy,
                sortType: sortDirection,
                searchTerm: searchTerm || undefined,
                filters: filters.length > 0 ? filters : undefined,
            }),
        getNextPageParam: (lastPage: IPaginatedResponse<IUserTableRow>) => {
            const { page, pageCount } = lastPage.meta;
            return page < pageCount ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const flatUsers = data?.pages.flatMap(page => page.data) || [];

    const onSelectRow = (indexs: number[]) => {
        flatUsers.map((row: Record<string, any>, i: number) => {
            if (indexs.includes(i)) {
                console.log(row);
            }
        })
    }

    const handleSort = (id: string, direction: SortDirection) => {
        setSortBy(id);
        setSortDirection(direction);
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    }

    const handleFilter = (newFilters: IFilterItem[]) => {
        setFilters(newFilters);
    }

    const handleReset = () => {
        setFilters([]);
    }

    /**
     * Вызывается из контекстного меню таблицы (ПКМ → «Отфильтровать по этому значению»).
     * Добавляет/заменяет IFilterItem с operator 'equal' для выбранной колонки.
     *
     * Фильтруются только строковые поля, которые принимает бэкенд.
     * Колонки со значениями-трансформациями (createdAt, isActive, roleName, id)
     * игнорируются — их отображаемые значения не совпадают с raw-данными бэкенда.
     */
    const onFilterByValue = (columnId: string, value: string) => {
        // Поля, которые можно передавать как 'equal' прямо в filters[]
        const DIRECTLY_FILTERABLE: string[] = ['firstName', 'lastName', 'email', 'patronymic'];

        if (!DIRECTLY_FILTERABLE.includes(columnId)) return;

        const newItem: IFilterItem = { key: columnId, operator: 'equal', value: String(value) };

        // Заменяем существующий фильтр по этому полю или добавляем новый
        setFilters(prev => {
            const without = prev.filter(f => f.key !== columnId);
            return [...without, newItem];
        });
    }


    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col overflow-x-hidden">
            <Heading title="Пользователи" description="Здесь вы можете управлять пользователями вашего магазина." />
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
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-1 w-full max-w-full">
                <div className="flex-1 min-w-0 bg-white border border-gray-200 flex flex-col overflow-hidden w-full">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <StoreTable
                            isMulti={true}
                            rows={flatUsers}
                            columns={columns}
                            onSelect={onSelectRow}

                            // Infinity scroll
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            status={status}
                            fetchNextPage={fetchNextPage}

                            //Sortable
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            onSort={handleSort}

                            //Filter
                            onFilterByValue={onFilterByValue}
                        />
                    </div>
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ */}
                <div className="w-100 shrink-0 bg-white border border-gray-200 p-4">
                    <TableSidebar
                        treeData={treeData}
                        filterConfig={UserFilterConfig}
                        onFilter={handleFilter}
                        onReset={handleReset}
                    />
                </div>
            </div>
        </div>
    );
}