import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  email: string;
  codigo_usuario: string;
  nome_usuario: string;
  codigo_grupo: string;
  nome_grupo: string;
};

type UserStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (payload: Partial<User>) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateUser: (payload) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...payload } : null,
          isAuthenticated: Boolean(state.user),
        })),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
