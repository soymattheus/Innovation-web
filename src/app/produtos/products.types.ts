import { Product } from "@/types/product";

export type ProductsPage = {
  items: Product[];
  nextPage: number | null;
  hasMore: boolean;
};

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export type ApiError = Error & { status?: number };
