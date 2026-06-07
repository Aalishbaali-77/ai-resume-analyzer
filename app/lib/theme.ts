import { create } from "zustand";

interface ThemeStore {
    isDark: boolean;
    toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()((set) => ({
    isDark: false,
    toggle: () =>
        set((state) => {
            const newVal = !state.isDark;
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", newVal ? "dark" : "light");
                document.documentElement.classList.toggle("dark", newVal);
            }
            return { isDark: newVal };
        }),
}));