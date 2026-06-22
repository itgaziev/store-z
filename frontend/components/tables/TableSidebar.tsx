'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
    ChevronRight, ChevronDown, Folder, FolderOpen, 
    Filter as FilterIcon, Network, Search, X, RotateCcw, 
    CirclePlus,
    CircleMinus,
    Circle
} from 'lucide-react';
import { FilterView } from './FilterView';
import { UserFilterConfig } from '@/lib/types/users.types';

type TabType = 'filter' | 'tree';

export const TableSidebar = ({ hasTree = true }: { hasTree?: boolean }) => {
    const [activeTab, setActiveTab] = useState<TabType>(hasTree ? 'tree' : 'filter');

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Вкладки сверху */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
                {hasTree && (
                    <button
                        onClick={() => setActiveTab('tree')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium border-b-2 transition-colors",
                            activeTab === 'tree' ? "border-blue-500 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Network className="w-4 h-4" />
                        Древо
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('filter')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium border-b-2 transition-colors",
                        activeTab === 'filter' ? "border-blue-500 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <FilterIcon className="w-4 h-4" />
                    Фильтр
                </button>
            </div>

            {/* Контентная часть со своим скроллом */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {activeTab === 'tree' && <TreeView />}
                {activeTab === 'filter' && <FilterView config={UserFilterConfig}/>}
            </div>
        </div>
    );
};

// --- Вспомогательный компонент: Древо категорий ---
const TreeView = () => {
    // Демо-данные для древа
    const treeData = [
        { id: '1', title: 'НОМЕНКЛАТУРА', children: [
            { id: '1.1', title: 'АВТО И ВЕЛОСИПЕД', children: [] },
            { id: '1.2', title: 'В НАЛИЧИИ', children: [
                { id: '1.2.1', title: 'Аксессуары' },
                { id: '1.2.2', title: 'Бытовая химия' },
            ]},
        ]},
        { id: '2', title: 'ИНСТРУМЕНТ', children: [] },
    ];

    return (
        <div className="space-y-1">
            {treeData.map(node => <TreeNode key={node.id} node={node} depth={0} />)}
        </div>
    );
};

const TreeNode = ({ node, depth }: { node: any, depth: number }) => {
    const [isOpen, setIsOpen] = useState(depth === 0); // Открываем первый уровень
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div>
            <div 
                className="flex items-center gap-1 py-1 px-2 hover:bg-blue-50 cursor-pointer rounded transition-colors group"
                onClick={() => setIsOpen(!isOpen)}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                {hasChildren ? (
                    isOpen ? <CircleMinus className="w-3 h-3 text-gray-400" /> : <CirclePlus className="w-3 h-3 text-gray-400" />
                ) : <Circle className="w-3 h-3 text-gray-400" />}
                
                {hasChildren ? (
                    isOpen ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />
                ) : <Folder className="w-4 h-4 text-yellow-500" />}
                
                <span className="text-xs text-gray-700 truncate">{node.title}</span>
            </div>
            {hasChildren && isOpen && (
                <div>
                    {node.children.map((child: any) => (
                        <TreeNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};