import { create } from "zustand";

interface IHeaderState {
    searchOpen: boolean;
    notificationOpen: boolean;
    userMenuOpen: boolean;
    actions: {
        setSearchOpen: (open: boolean) => void;
        setNotificationOpen: (open: boolean) => void;
        setUserMenuOpen: (open: boolean) => void;
        toggleNotification: () => void;
        toggleUser: () => void;
    };
};

const initialHeaderState = {
    searchOpen: false,
    notificationOpen: false,
    userMenuOpen: false,
};

export const useHeaderStore = create<IHeaderState>((set, get) => ({
    ...initialHeaderState,
    actions: {
        setSearchOpen: (searchOpen) => set({ searchOpen }),
        setNotificationOpen: (notificationOpen) => set({ notificationOpen }),
        setUserMenuOpen: (userMenuOpen) => set({ userMenuOpen }),
        toggleNotification: () => {
            set( state => ({ notificationOpen : !state.notificationOpen }))
            if (get().notificationOpen) {
                set(state => ({ userMenuOpen: false }))
            }
        },
        toggleUser: () => {
            set( state => ({ userMenuOpen : !state.userMenuOpen }))
            if (get().userMenuOpen) {
                set(state => ({ notificationOpen: false }))
            }
        }
    }
}))

export const useHeaderSearch = () => useHeaderStore(state => state.searchOpen);
export const useHeaderNotification = () => useHeaderStore(state => state.notificationOpen);
export const useHeaderUser = () => useHeaderStore(state => state.userMenuOpen);
export const useHeaderActions = () => useHeaderStore(state => state.actions);
export const useNotificationToggle = () => {
    if (!useHeaderNotification()) useHeaderActions().setUserMenuOpen(false);
    useHeaderActions().setNotificationOpen(!useHeaderNotification());
}
export const useUserToggle = () => {
    if (!useHeaderUser()) useHeaderActions().setNotificationOpen(false);
    useHeaderActions().setUserMenuOpen(!useHeaderUser());
}