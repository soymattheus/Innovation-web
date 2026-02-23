import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.email !== "dinamica") {
    return NextResponse.json({ message: "Usuário inválido" }, { status: 404 });
  }

  if (body.password !== "123456") {
    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    user: {
      email: "claudia@email.com",
      codigo_usuario: "0001",
      nome_usuario: "Claudia Silva Santos",
      codigo_grupo: "1",
      nome_grupo: "Admin",
    },
  });
}
