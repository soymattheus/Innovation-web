import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    " https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/login/acessar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        senha: body.password,
      }),
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { message: "Erro ao fazer login" },
      { status: res.status },
    );
  }

  const response = await res.json();

  if (!response.status) {
    return NextResponse.json({ message: response.message }, { status: 401 });
  }

  const cookieStore = await cookies();

  cookieStore.set("token", response.token_de_acesso, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    user: response.dados_usuario,
  });
}
