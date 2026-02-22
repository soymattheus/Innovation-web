import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const payload = {
    email: body.email,
    password: body.password,
  };
  console.log("payload:", payload);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login/acessar`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { statusText: data.message },
      { status: response.status },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("token", data.token_de_acesso, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    user: data.dados_usuario,
  });
}
