'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { axiosWithAuth } from '../api/interceptors';
import { IFilterTableOption } from '../types/table.types';

const PAGE_LIMIT = 20;
const DEBOUNCE_MS = 300;

interface UseInfiniteFilterOptionsParams {
    endpoint: string | undefined;
    bindLabel?: string;
    bindValue?: string;
    /** Хук делает запросы только когда enabled=true (модальное окно открыто) */
    enabled: boolean;
}

interface UseInfiniteFilterOptionsResult {
    options: IFilterTableOption[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    loadMore: () => void;
}

export function useInfiniteFilterOptions({
    endpoint,
    bindLabel = 'name',
    bindValue = 'id',
    enabled,
}: UseInfiniteFilterOptionsParams): UseInfiniteFilterOptionsResult {
    const [options, setOptions] = useState<IFilterTableOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Реф текущей страницы — не нужен в рендере, поэтому useRef
    const pageRef = useRef(1);
    // Флаг: идёт ли уже запрос (защита от двойных вызовов)
    const fetchingRef = useRef(false);

    /**
     * Базовая функция запроса одной страницы.
     * @param page    - номер страницы
     * @param search  - поисковый запрос
     * @param append  - true → дозагрузка в конец, false → перезапись
     */
    const fetchPage = useCallback(
        async (page: number, search: string, append: boolean) => {
            if (!endpoint || fetchingRef.current) return;

            fetchingRef.current = true;
            append ? setLoadingMore(true) : setLoading(true);

            try {
                const params: Record<string, string | number> = {
                    page,
                    limit: PAGE_LIMIT,
                };
                if (search.trim()) {
                    params.searchTerm = search.trim();
                }

                const response = await axiosWithAuth.get(endpoint, { params });

                // Нормализация: массив или { data: [...] }
                const raw = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ?? [];

                const mapped: IFilterTableOption[] = raw.map((item: any) => ({
                    value: item[bindValue],
                    label: item[bindLabel],
                }));

                setOptions(prev => (append ? [...prev, ...mapped] : mapped));

                // Если пришло меньше лимита — следующей страницы нет
                const moreAvailable =
                    response.data?.hasMore !== undefined
                        ? Boolean(response.data.hasMore)
                        : mapped.length === PAGE_LIMIT;

                setHasMore(moreAvailable);
            } catch (e) {
                console.error('[useInfiniteFilterOptions] fetch error:', e);
                setHasMore(false);
            } finally {
                fetchingRef.current = false;
                append ? setLoadingMore(false) : setLoading(false);
            }
        },
        [endpoint, bindLabel, bindValue],
    );

    // Первичная загрузка при открытии модального окна
    useEffect(() => {
        if (!enabled || !endpoint) return;

        pageRef.current = 1;
        setHasMore(true);
        fetchPage(1, searchTerm, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, endpoint]);

    // Debounced реакция на изменение searchTerm
    useEffect(() => {
        if (!enabled || !endpoint) return;

        const timer = setTimeout(() => {
            pageRef.current = 1;
            setHasMore(true);
            fetchPage(1, searchTerm, false);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
        // fetchPage стабилен (useCallback с неизменными deps)
    }, [searchTerm, enabled, endpoint, fetchPage]);

    /** Подгрузить следующую страницу */
    const loadMore = useCallback(() => {
        if (!hasMore || fetchingRef.current) return;
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchPage(nextPage, searchTerm, true);
    }, [hasMore, searchTerm, fetchPage]);

    return {
        options,
        loading,
        loadingMore,
        hasMore,
        searchTerm,
        setSearchTerm,
        loadMore,
    };
}
