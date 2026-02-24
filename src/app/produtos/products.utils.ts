import { Product } from "@/types/product";
import { SortOption } from "./products.types";

export const FAVORITES_STORAGE_KEY = "favorite-products";
export const PAGINATION_LIMIT = 5;
export const SKELETON_ITEMS = 5;
export const PAGINATION_SKELETON_ITEMS = 2;

export function parseFavoriteCodes(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const list = [...products];

  if (sortBy === "price-asc") {
    return list.sort((a, b) => Number(a.preco) - Number(b.preco));
  }

  if (sortBy === "price-desc") {
    return list.sort((a, b) => Number(b.preco) - Number(a.preco));
  }

  if (sortBy === "name-desc") {
    return list.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
  }

  return list.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}
