'use client'

import { IFilterTable } from "@/lib/types/table.types"
import { useState } from "react";
import { FilterNumber } from "../filter/FilterNumber";
import { FilterString } from "../filter/FilterString";
import { FilterDate } from "../filter/FilterDate";
import { FilterSelect } from "../filter/FilterSelect";
import { FilterBoolean } from "../filter/FilterBoolean";
import { FilterModal } from "../filter/FilterModal";
import { useInfiniteFilterOptions } from "@/lib/hooks/useInfiniteFilterOptions";

interface FilterFieldProps {
    filter: IFilterTable;
    value: any;
    onChange: (value: any) => void;
}

export const FilterField = ({ filter, value, onChange }: FilterFieldProps) => {
    // Контролируем открытость модального окна здесь,
    // чтобы передать флаг `enabled` в хук — тот не делает запросов пока окно закрыто
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        options,
        loading,
        loadingMore,
        hasMore,
        searchTerm,
        setSearchTerm,
        loadMore,
    } = useInfiniteFilterOptions({
        endpoint: filter.type === 'MODAL' ? filter.endpoint : undefined,
        bindLabel: filter.bindLabel,
        bindValue: filter.bindValue,
        enabled: isModalOpen,
    });

    switch (filter.type) {
        case 'NUMBER':
            return <FilterNumber value={value} onChange={onChange} placeholder={filter.placeholder} />;

        case 'STRING':
            return <FilterString value={value} onChange={onChange} placeholder={filter.placeholder} />;

        case 'DATE':
            return <FilterDate value={value} onChange={onChange} />;

        case 'BOOLEAN':
            return <FilterBoolean value={value} onChange={onChange} />;

        case 'SELECT':
            // Передаем фиксированные опции из конфигурации фильтра
            return <FilterSelect value={value} onChange={onChange} options={filter.options} />;

        case 'MODAL':
            return (
                <FilterModal
                    title={filter.title}
                    value={value}
                    onChange={onChange}
                    placeholder={filter.placeholder}
                    options={options}
                    loading={loading}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onLoadMore={loadMore}
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            );

        default:
            return null;
    }
}