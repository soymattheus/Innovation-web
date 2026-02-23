import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Product = {
  nome: string;
  codigo: string;
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

  const response = await fetch(
    "http://localhost:9891/api/innova-dinamica/produtos/listar",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    let errorMessage = "Failed to fetch products";
    try {
      const errorPayload = await response.json();
      errorMessage = errorPayload?.message || errorPayload?.error || errorMessage;
    } catch {
      // keep default message when backend does not return JSON
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: response.status },
    );
  }

  const payload = await response.json();
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

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
