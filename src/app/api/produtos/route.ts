import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Product = {
  nome: string;
  referencia: string;
  codigo: string;
  codigo_categoria: string;
  descricao: string;
  preco: number;
  imagem: string;
};

type PaginatedProductsResponse = {
  items: Product[];
  nextPage: number | null;
  hasMore: boolean;
};

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const res = await fetch(
    " https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/produtos/listar",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { message: "Erro ao buscar produtos" },
      { status: res.status },
    );
  }

  const data = await res.json();

  const items = Array.isArray(data) ? data : Array.isArray(data) ? data : [];

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  const pagedItems = items.slice(start, end);
  const hasMore = end < items.length;

  const result: PaginatedProductsResponse = {
    items: pagedItems,
    nextPage: hasMore ? safePage + 1 : null,
    hasMore,
  };

  return NextResponse.json(result);
}
