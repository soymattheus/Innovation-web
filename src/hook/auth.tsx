import { useRouter } from "next/navigation";
import useUserStore from "@/store/user";

export default function useAuth() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const user = await res.json();

    if (!res.ok) {
      throw new Error(user.statusText || "Login failed");
    }

    setUser(user.user);
    router.replace("/produtos");
  };

  const logout = () => {
    clearUser();
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      router.replace("/login");
    });
  };

  return { login, logout };
}
