'use client';

import { SearchIcon } from "lucide-react";
import React, { startTransition, useState } from "react";

interface SearchTableProps {
    onSearch: (value: string) => void;
}

export const SearchTable = ({ onSearch }: SearchTableProps) => {
    const [isPending, setIsPending] = useState(false);
    const [query, setQuery] = useState('');


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearch) {
            startTransition(() => onSearch(value));
        }
    };
    return (
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Поиск ..."
                value={query}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
        </div>
    );
}