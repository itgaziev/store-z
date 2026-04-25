import { create } from 'zustand';

interface ISidebarState {
    isOpen: boolean;
    isVisible: boolean;
    expandedItems: string[];
    actions: {
        setOpen: (isOpen: boolean) => void;
        setVisible: (isVisible: boolean) => void;
        toggleExpanded: (key: string) => void;
        toggleVisible: () => void;
    }
}

const initialSidebarState = {
    isOpen: true,
    isVisible: true,
    expandedItems: []
}

export const useSidebarStore = create<ISidebarState>((set) => ({
    ...initialSidebarState,
    actions: {
        setOpen: (isOpen) => set({ isOpen }),
        setVisible: (isVisible) => set({ isVisible }),
        toggleExpanded: (key) => 
            set((state) => ({
                expandedItems: state.expandedItems.includes(key)
                    ? state.expandedItems.filter((item) => item !== key)
                    : [...state.expandedItems, key]
            })),
        toggleVisible: () => set(state =>({ isVisible: !state.isVisible }))
    },
}));

export const useSidebarIsOpen = () => useSidebarStore((state) => state.isOpen);
export const useSidebarVisible = () => useSidebarStore((state) => state.isVisible);
export const useSidebarExpandedItems = () => useSidebarStore((state) => state.expandedItems);
export const useSidebarActions = () => useSidebarStore((state) => state.actions);