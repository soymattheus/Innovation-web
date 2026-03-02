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

type ProductFilters = {
  nome?: string;
  codigo?: string;
};

const PRODUCTS_API_URL =
  "https://apihomolog.innovationbrindes.com.br/api/innova-dinamica/produtos/listar";

function paginateProducts(
  items: Product[],
  page: number,
  limit: number,
): PaginatedProductsResponse {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  const pagedItems = items.slice(start, end);
  const hasMore = end < items.length;

  return {
    items: pagedItems,
    nextPage: hasMore ? safePage + 1 : null,
    hasMore,
  };
}

function normalizeProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload as Product[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "items" in payload &&
    Array.isArray((payload as { items: unknown }).items)
  ) {
    return (payload as { items: Product[] }).items;
  }

  return [];
}

async function fetchProducts(
  token: string,
  filters?: ProductFilters,
): Promise<Product[]> {
  const shouldUsePost = Boolean(filters?.nome || filters?.codigo);

  console.log(filters?.nome);
  const response = await fetch(PRODUCTS_API_URL, {
    method: shouldUsePost ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(shouldUsePost ? { "Content-Type": "application/json" } : {}),
    },
    ...(shouldUsePost
      ? {
          body: JSON.stringify({
            nome_produto: filters?.nome ? filters.nome : undefined,
            codigo_produto: filters?.codigo ? filters.codigo : undefined,
          }),
        }
      : {}),
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const data = await response.json();
  return normalizeProducts(data);
}

function getPaginationParams(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  return { page, limit };
}

function getUnauthorizedResponse() {
  return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
}

function getErrorResponse(status: string) {
  return NextResponse.json(
    { message: "Erro ao buscar produtos" },
    { status: Number(status) || 500 },
  );
}

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return getUnauthorizedResponse();
  }

  const { page, limit } = getPaginationParams(request);

  try {
    const items = await fetchProducts(token);
    return NextResponse.json(paginateProducts(items, page, limit));
  } catch (error) {
    return getErrorResponse((error as Error).message);
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return getUnauthorizedResponse();
  }

  const { page, limit } = getPaginationParams(request);

  const body = (await request.json().catch(() => ({}))) as ProductFilters;
  const filters: ProductFilters = {
    nome: typeof body.nome === "string" ? body.nome.trim() : undefined,
    codigo: typeof body.codigo === "string" ? body.codigo.trim() : undefined,
  };

  try {
    const items = await fetchProducts(token, filters);
    return NextResponse.json(paginateProducts(items, page, limit));
  } catch (error) {
    return getErrorResponse((error as Error).message);
  }
}
