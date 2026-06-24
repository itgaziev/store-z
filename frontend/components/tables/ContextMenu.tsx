'use client';

import { cn } from '@/lib/utils';
import { ContextMenuState } from '@/lib/hooks/useContextMenu';
import { Filter } from 'lucide-react';

interface ContextMenuAction {
    label: string;
    icon?: React.ReactNode;
    onClick: (state: ContextMenuState) => void;
    /** Если true — ставим разделитель перед пунктом */
    dividerBefore?: boolean;
}

interface ContextMenuProps {
    state: ContextMenuState;
    menuRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
    /** Дополнительные пункты меню помимо встроенных */
    extraActions?: ContextMenuAction[];
    /** Колбэк «Отфильтровать по значению» */
    onFilterByValue: (columnId: string, value: any) => void;
}

export const ContextMenu = ({
    state,
    menuRef,
    onClose,
    extraActions = [],
    onFilterByValue,
}: ContextMenuProps) => {
    if (!state.visible) return null;

    const builtinActions: ContextMenuAction[] = [
        {
            label: 'Отфильтровать по этому значению',
            icon: <Filter className="w-3.5 h-3.5" />,
            onClick: ({ columnId, cellValue }) => {
                onFilterByValue(columnId, cellValue);
                onClose();
            },
        },
    ];

    const allActions = [...builtinActions, ...extraActions];

    return (
        // Портал через fixed-позиционирование; z-[9999] чтобы быть выше sticky-thead
        <div
            ref={menuRef as React.RefObject<HTMLDivElement | null>}
            role="menu"
            aria-label="Контекстное меню строки таблицы"
            className={cn(
                'fixed z-[9999] min-w-[200px] max-w-[260px]',
                'bg-white border border-gray-200 rounded-lg shadow-lg',
                'py-1 select-none overflow-hidden',
                'animate-in fade-in-0 zoom-in-95 duration-100',
            )}
            style={{ top: state.position.y, left: state.position.x }}
            // Блокируем правый клик внутри самого меню
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Заголовок с превью значения */}
            <div className="px-3 py-1.5 border-b border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Значение ячейки
                </p>
                <p className="text-xs text-gray-700 font-medium truncate mt-0.5">
                    {state.cellValue !== null && state.cellValue !== undefined && state.cellValue !== ''
                        ? String(state.cellValue)
                        : <span className="italic text-gray-400">пусто</span>
                    }
                </p>
            </div>

            {/* Список действий */}
            <ul className="py-0.5">
                {allActions.map((action, idx) => (
                    <li key={idx}>
                        {action.dividerBefore && (
                            <hr className="my-1 border-gray-100" />
                        )}
                        <button
                            role="menuitem"
                            onClick={() => action.onClick(state)}
                            className={cn(
                                'w-full flex items-center gap-2.5 px-3 py-2',
                                'text-xs text-gray-700 text-left',
                                'hover:bg-blue-50 hover:text-blue-700',
                                'transition-colors duration-100 cursor-pointer',
                            )}
                        >
                            {action.icon && (
                                <span className="shrink-0 text-gray-400 group-hover:text-blue-500">
                                    {action.icon}
                                </span>
                            )}
                            {action.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
