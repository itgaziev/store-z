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
                {activeTab === 'filter' && <FilterView />}
            </div>

            {/* Нижняя панель кнопок (только для фильтра) */}
            {activeTab === 'filter' && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                        Применить
                    </button>
                    <button className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors">
                        Отключить
                    </button>
                </div>
            )}
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

// --- Вспомогательный компонент: Форма фильтров ---
const FilterView = () => {
    return (
        <div className="space-y-5">
            {/* Артикул */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Артикул</label>
                <div className="flex gap-1">
                    <select className="w-20 text-[12px] border border-gray-300 rounded px-1 outline-none focus:ring-1 focus:ring-blue-500">
                        <option>Равно</option>
                        <option>Содержит</option>
                    </select>
                    <input type="text" className="flex-1 text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {/* Вид товара */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Вид товара</label>
                <div className="relative">
                    <select className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 appearance-none outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                        <option>Все товары</option>
                        <option>Услуги</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Цена */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Цена (от - до)</label>
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="0" className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none" />
                    <span className="text-gray-400">—</span>
                    <input type="number" placeholder="999..." className="w-full text-[12px] border border-gray-300 rounded px-2 py-1.5 outline-none" />
                </div>
            </div>

             {/* Категория */}
             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Категория</label>
                <div className="p-2 border border-gray-200 rounded-md bg-gray-50/50 max-h-32 overflow-y-auto space-y-2">
                    {['Продукты', 'Химия', 'Одежда', 'Прочее'].map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-xs text-gray-600 group-hover:text-gray-900">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Дополнительные блоки (аккордеоны) */}
            <div className="pt-2">
                {['Характеристики', 'Аналитика'].map(item => (
                    <div key={item} className="border-t border-gray-100 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-1">
                        <span className="text-xs text-gray-600">{item}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};