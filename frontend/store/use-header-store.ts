import { create } from "zustand";

interface IHeaderState {
    searchOpen: boolean;
    notificationOpen: boolean;
    userMenuOpen: boolean;
    fullScreen: boolean;
    actions: {
        setSearchOpen: (open: boolean) => void;
        setNotificationOpen: (open: boolean) => void;
        setUserMenuOpen: (open: boolean) => void;
        toggleNotification: () => void;
        toggleUser: () => void;
        setFullScreen: () => void;
    };
};

const initialHeaderState = {
    searchOpen: false,
    notificationOpen: false,
    userMenuOpen: false,
    fullScreen: false,
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
        },
        setFullScreen: () => {
            if (window.document.fullscreenElement) {
                window.document.exitFullscreen();
                set({ fullScreen: false });
            } else {
                window.document.documentElement.requestFullscreen();
                set({ fullScreen: true });
            }
        }
    }
}))

export const useHeaderSearch = () => useHeaderStore(state => state.searchOpen);
export const useHeaderNotification = () => useHeaderStore(state => state.notificationOpen);
export const useHeaderFullScreen = () => useHeaderStore(state => state.fullScreen);
export const useHeaderUser = () => useHeaderStore(state => state.userMenuOpen);
export const useHeaderActions = () => useHeaderStore(state => state.actions);
export const useNotificationToggle = () => useHeaderActions().toggleNotification();
export const useUserToggle = () => useHeaderActions().toggleUser();