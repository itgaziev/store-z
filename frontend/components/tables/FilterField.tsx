'use client'

import { axiosWithAuth } from "@/lib/api/interceptors";
import { IFilterTable, IFilterTableOption } from "@/lib/types/table.types"
import { useCallback, useState } from "react";
import { FilterNumber } from "../filter/FilterNumber";
import { FilterString } from "../filter/FilterString";
import { FilterDate } from "../filter/FilterDate";
import { FilterSelect } from "../filter/FilterSelect";
import { FilterBoolean } from "../filter/FilterBoolean";
import { FilterModal } from "../filter/FilterModal";

interface FilterFieldProps {
    filter: IFilterTable;
    value: any;
    onChange: (value: any) => void;
}

export const FilterField = ({ filter, value, onChange }: FilterFieldProps) => {
    const [options, setOptions] = useState<IFilterTableOption[]>([]);
    const [loading, setLoading] = useState(false);

    // Функция загрузки данных вызывается ТЕПЕРЬ СТРОГО для типа MODAL
    const loadFilterOptions = useCallback(async () => {
        if (!filter.endpoint) return;
        setLoading(true);
        try {
            const response = await axiosWithAuth.get(filter.endpoint);
            const items = Array.isArray(response.data) ? response.data : response.data.data || [];
            const mappedOptions = items.map((item: any) => ({
                value: item[filter.bindValue || 'id'],
                label: item[filter.bindLabel || 'name']
            }));
            setOptions(mappedOptions);
        } catch (e) {
            console.error('Error loading filter options: ', e);
        } finally {
            setLoading(false);
        }
    }, [filter.endpoint, filter.bindValue, filter.bindLabel]);

    // Ленивая загрузка для модального окна (только когда кликнули)
    const handleModalOpen = () => {
        if (options.length === 0) {
            loadFilterOptions();
        }
    };

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
                    options={options} // Сюда идут опции из стейта, загруженные по сети
                    loading={loading}
                    onOpen={handleModalOpen}
                />
            );

        default:
            return null;
    }
}