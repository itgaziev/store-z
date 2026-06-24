'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export interface ContextMenuState {
    visible: boolean;
    position: ContextMenuPosition;
    /** Значение ячейки, по которой кликнули */
    cellValue: any;
    /** ID колонки, по которой кликнули */
    columnId: string;
}

const INITIAL_STATE: ContextMenuState = {
    visible: false,
    position: { x: 0, y: 0 },
    cellValue: null,
    columnId: '',
};

/** Предполагаемые размеры меню для расчёта позиции у края экрана */
const MENU_WIDTH = 220;
const MENU_HEIGHT = 90;

interface UseContextMenuResult {
    menuState: ContextMenuState;
    /** ref — нужно повесить на корневой элемент <ContextMenu> */
    menuRef: React.RefObject<HTMLElement | null>;
    handleContextMenu: (
        event: React.MouseEvent,
        columnId: string,
        cellValue: any,
    ) => void;
    closeMenu: () => void;
}

export function useContextMenu(): UseContextMenuResult {
    const [menuState, setMenuState] = useState<ContextMenuState>(INITIAL_STATE);
    const menuRef = useRef<HTMLElement | null>(null);

    const closeMenu = useCallback(() => {
        setMenuState(prev => ({ ...prev, visible: false }));
    }, []);

    const handleContextMenu = useCallback(
        (event: React.MouseEvent, columnId: string, cellValue: any) => {
            event.preventDefault();
            event.stopPropagation();

            // Корректируем позицию, если меню выходит за края экрана
            const x =
                event.clientX + MENU_WIDTH > window.innerWidth
                    ? event.clientX - MENU_WIDTH
                    : event.clientX;
            const y =
                event.clientY + MENU_HEIGHT > window.innerHeight
                    ? event.clientY - MENU_HEIGHT
                    : event.clientY;

            setMenuState({ visible: true, position: { x, y }, cellValue, columnId });
        },
        [],
    );

    // Закрытие по клику вне меню
    useEffect(() => {
        if (!menuState.visible) return;

        const onMouseDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeMenu();
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuState.visible, closeMenu]);

    return { menuState, menuRef, handleContextMenu, closeMenu };
}
