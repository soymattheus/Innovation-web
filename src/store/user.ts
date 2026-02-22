import { create } from "zustand";

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

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (payload) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...payload } : null,
      isAuthenticated: Boolean(state.user),
    })),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useUserStore;
