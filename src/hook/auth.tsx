import { useRouter } from "next/navigation";
import useUserStore from "@/store/user";
import { useToast } from "@/components/toast/toastProvider";
import React from "react";

type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function useAuth() {
  const router = useRouter();
  const { showToast } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = React.useState(false);

  const login = async ({ email, password, rememberMe = false }: LoginPayload) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const user = await res.json();

      if (!res.ok) {
        const message = user.statusText || "Erro ao realizar login";
        showToast(message, "error");
        return;
      }

      setUser(user.user);
      router.replace("/produtos");
    } catch (error) {
      if (error instanceof Error) {
        showToast("Erro de conexão ao tentar fazer login.", "error");
        return;
      }

      showToast("Erro inesperado ao tentar fazer login.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearUser();
    fetch("/api/auth/logout", { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          showToast("Não foi possível finalizar a sessão.", "error");
        }
      })
      .catch(() => {
        showToast("Erro ao encerrar sessão.", "error");
      })
      .finally(() => {
        router.replace("/login");
      });
  };

  return { login, logout, isLoading };
}
