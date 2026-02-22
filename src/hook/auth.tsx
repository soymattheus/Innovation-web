import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();

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

    router.replace("/dashboard");
    return user;
  };

  const logout = () => {
    // Implement logout logic, e.g., clear tokens, redirect, etc.
  };

  return { login, logout };
}
