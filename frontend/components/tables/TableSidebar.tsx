'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Filter as FilterIcon, Network } from 'lucide-react';
import { FilterView } from './FilterView';
import { TreeView } from './TreeView';
import { IFilterItem, IFilterTable } from '@/lib/types/table.types';
import { TreeNodeData } from '@/lib/types/inerfaces';

// ─── Типы ────────────────────────────────────────────────────────────────────

type TabType = 'filter' | 'tree';

interface ITableSidebarProps {
    /** Данные древа. Если не переданы — вкладка «Древо» не отображается */
    treeData?: TreeNodeData[];
    filterConfig?: IFilterTable[];
    onFilter?: (filters: IFilterItem[]) => void;
    onReset?: () => void;
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export const TableSidebar = ({ treeData, filterConfig, onFilter, onReset }: ITableSidebarProps) => {
    const hasTree = Boolean(treeData?.length);
    const hasFilter = Boolean(filterConfig?.length);

    // Выбираем начальную вкладку: tree → если есть, иначе filter
    const defaultTab: TabType = hasTree ? 'tree' : 'filter';
    const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

    // Если нет ни дерева, ни фильтра — не рендерим компонент
    if (!hasTree && !hasFilter) return null;

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Переключатель вкладок — только если доступны обе */}
            {hasTree && hasFilter && (
                <div className="flex border-b border-gray-200 bg-gray-50/50 shrink-0">
                    <SidebarTab
                        label="Древо"
                        icon={<Network className="w-4 h-4" />}
                        isActive={activeTab === 'tree'}
                        onClick={() => setActiveTab('tree')}
                    />
                    <SidebarTab
                        label="Фильтр"
                        icon={<FilterIcon className="w-4 h-4" />}
                        isActive={activeTab === 'filter'}
                        onClick={() => setActiveTab('filter')}
                    />
                </div>
            )}

            {/* Статичный заголовок — если доступна только одна вкладка */}
            {hasTree && !hasFilter && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50/50 shrink-0">
                    <Network className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Древо</span>
                </div>
            )}
            {!hasTree && hasFilter && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50/50 shrink-0">
                    <FilterIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Фильтр</span>
                </div>
            )}

            {/* Контент */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {activeTab === 'tree' && hasTree && (
                    <TreeView data={treeData!} />
                )}
                {activeTab === 'filter' && hasFilter && (
                    <FilterView config={filterConfig} onFilter={onFilter} onReset={onReset} />
                )}
            </div>
        </div>
    );
};

// ─── Атомарный компонент вкладки ──────────────────────────────────────────────

interface SidebarTabProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const SidebarTab = ({ label, icon, isActive, onClick }: SidebarTabProps) => (
    <button
        onClick={onClick}
        className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3',
            'text-xs font-medium border-b-2 transition-colors',
            isActive
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700',
        )}
    >
        {icon}
        {label}
    </button>
);