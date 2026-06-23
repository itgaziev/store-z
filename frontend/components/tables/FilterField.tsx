'use client'

import { axiosWithAuth } from "@/lib/api/interceptors";
import { IFilterTable, IFilterTableOption } from "@/lib/types/table.types"
import { cn } from "@/lib/utils";
import { LoaderPinwheel, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FilterNumberField } from "../filter/FilterNumber";

interface FilterFieldProps {
    filter: IFilterTable;
    value: any;
    onChange: (value: any) => void;
}

export const FilterField = ({ filter, value, onChange }: FilterFieldProps) => {
    const [options, setOptions] = useState<IFilterTableOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchModalTerm, setSearchModalTerm] = useState('');

    const loadFilterOptions = useCallback(async () => {
        if (!filter.endpoint) return;
        setLoading(true);
        try {
            const response = await axiosWithAuth.get(filter.endpoint!);
            const items = Array.isArray(response.data) ? response.data : response.data.data || [];
            const mappedOptions = items.map((item: any) => ({
                value: item[filter.bindValue || 'id'],
                label: item[filter.bindLabel || 'name']
            }))
            setOptions(mappedOptions);
        } catch (e) {
            console.error('Error loaded filter: ', e);
        } finally {
            setLoading(false);
        }
    }, [filter.endpoint, filter.bindValue, filter.bindLabel]);

    const openModalAndFetch = async () => {
        setIsModalOpen(true);
        if (options.length === 0) {
            await loadFilterOptions();
        }
    }

    useEffect(() => {
        if (filter.type === 'SELECT') {
            loadFilterOptions();
        }
    }, [filter.type, loadFilterOptions])

    if (filter.type === 'NUMBER') {
        return (
            <FilterNumberField 
                value={value}
                onChange={onChange}
                placeholder={filter.placeholder}
            />
        )
    }

    if (filter.type === 'STRING') {
        return (
            <input
                type="text"
                placeholder={filter.placeholder || 'Введите значение ...'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
            />
        )
    }

    if (filter.type === 'SELECT') {
        return (
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-blue-500 bg-white"
            >
                <option value="">Все</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        )
    }

    if (filter.type === 'BOOLEAN') {
        return (
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-blue-500 bg-white"
            >
                <option value="">Все</option>
                <option value="Y">Да</option>
                <option value="N">Нет</option>
            </select>
        )
    }

    if (filter.type === 'MODAL') {
        const selectedOption = options.find(opt => opt.value === value);

        return (
            <div>
                <div
                    onClick={openModalAndFetch}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors truncate flex justify-between items-center"
                >
                    <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                        {selectedOption ? selectedOption.label : (filter.placeholder || "Выбрать из списка")}
                    </span>
                    <Search className="w-3 h-3 text-gray-400" />
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-100">
                            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-gray-200 flex justify-between items-center">{filter.title}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                            </div>

                            <div className="p-2 border-b border-gray-100">
                                <input
                                    type="text"
                                    placeholder="Поиск в списке ..."
                                    value={searchModalTerm}
                                    onChange={(e) => setSearchModalTerm(e.target.value)}
                                    className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {loading ? (
                                    <div className="flex justify-center p-4"><LoaderPinwheel className="w-5 h-5 animate-spin text-blue-500" /></div>
                                ) : (
                                    options
                                        .filter(opt => opt.label.toLowerCase().includes(searchModalTerm.toLowerCase()))
                                        .map(opt => (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    onChange(opt.value);
                                                    setIsModalOpen(false);
                                                }}
                                                className={cn(
                                                    'p-2 text-xs rounded cursor-pointer transition-colors',
                                                    value === opt.value ?
                                                        'bg-blue-100 text-blue-700 font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                )}
                                            >
                                                {opt.label}
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return null;
}