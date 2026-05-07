import { userService } from "@/lib/services/users.services";
import { IUser } from "@/lib/types/users.types";
import { create } from "zustand";

interface UserState {
    user: IUser | null;
    isLoading: boolean;
    fetchUser: () => Promise<void>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    isLoading: false,
    fetchUser: async () => {
        if (get().user) return; // Если пользователь уже загружен, не загружаем снова

        set({ isLoading: true });
        try {
            const response = await userService.me();
            set({ user: response, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false  });
            console.error("Failed to fetch user:", error);
        } finally {
            set({ isLoading: false}); // Здесь нужно заменить null на реальный ответ от сервера
        }
    },
    clearUser: () => set({ user: null })
}));