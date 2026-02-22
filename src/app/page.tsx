"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import Checkbox from "@/components/checkbox";
import { InputField, InputIcon, InputRoot } from "@/components/input";
import Link from "next/link";
import React from "react";
import useAuth from "@/hook/auth";
import { LockOpen, UserRound } from "lucide-react";

const loginSchema = z.object({
  email: z
    .email("Insira um email válido.")
    .nonempty("O campo email é obrigatório."),
  password: z.string("Insira a sua senha.").min(6, {
    message: "O campo senha deve ter ao menos 6 caracteres..",
  }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Home() {
  const { login } = useAuth();
  const [checked, setChecked] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onLogin(payload: LoginSchema) {
    await login(payload);
  }

  return (
    <main className="flex flex-col min-h-screen w-full px-10 py-4 gap-6 bg-[#1e1e1e] text-white items-center justify-center">
      <h1 className="text-4xl font-bold text-[#8cc726] text-center">
        Bem-vindo a Innovatrion Brindes
      </h1>

      <form
        onSubmit={handleSubmit(onLogin)}
        className="w-full md:w-3/6 bg-[#8cc726] rounded-lg shadow-md py-15 px-8"
      >
        <div className="flex flex-col items-center w-full md:w-5/6 gap-3 mx-auto">
          {/* user */}
          <InputRoot>
            <InputIcon>
              <UserRound />
            </InputIcon>

            <InputField
              type="text"
              placeholder="Usuário"
              {...register("email")}
            />
          </InputRoot>

          {/* password */}
          <InputRoot>
            <InputIcon>
              <LockOpen />
            </InputIcon>

            <InputField
              type="password"
              placeholder="Senha"
              {...register("password")}
            />
          </InputRoot>

          {/* rememberMe and forgetPassword */}
          <div className="flex flex-col md:flex-row w-full gap-3 justify-center md:justify-between items-center">
            <Checkbox
              label="Manter logado"
              checked={checked}
              onChange={(checked) => setChecked(checked)}
            />

            <div className="flex flex-row gap-3">
              <Link href="#">Esqueceu a senha?</Link>
            </div>
          </div>

          <Button type="submit">Login</Button>
        </div>
      </form>
    </main>
  );
}
