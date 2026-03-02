"use client";

import dynamic from "next/dynamic";
import { Product } from "@/types/product";
import Header from "./header";
import ProductCard from "./productCard";
import ProductsToolbar from "./productsToolbar";
import ProductsSkeletonGrid from "./productsSkeletonGrid";
import ProductsErrorState from "./productsErrorState";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAuth from "@/hook/auth";
import { useToast } from "@/components/toast/toastProvider";
import { ApiError, ProductsPage, SortOption } from "./products.types";
import {
  FAVORITES_STORAGE_KEY,
  PAGINATION_LIMIT,
  PAGINATION_SKELETON_ITEMS,
  SKELETON_ITEMS,
  parseFavoriteCodes,
  sortProducts,
} from "./products.utils";

const ProductDetailsModal = dynamic(() => import("./productDetailsModal"), {
  ssr: false,
  loading: () => null,
});

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export default function Produtos() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const handledUnauthorizedRef = useRef(false);
  const lastToastErrorRef = useRef<string | null>(null);
  const nextPageErrorToastShownRef = useRef(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return parseFavoriteCodes(localStorage.getItem(FAVORITES_STORAGE_KEY));
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const debouncedSearchName = useDebouncedValue(searchName, 400).trim();
  const debouncedSearchCode = useDebouncedValue(searchCode, 400).trim();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery<ProductsPage>({
    queryKey: ["produtos", debouncedSearchName, debouncedSearchCode],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `/api/produtos?page=${pageParam}&limit=${PAGINATION_LIMIT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: debouncedSearchName || undefined,
            codigo: debouncedSearchCode || undefined,
          }),
        },
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const queryError = new Error(
          payload?.error || "Falha ao buscar produtos",
        ) as ApiError;
        queryError.status = response.status;
        throw queryError;
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    const apiError = error as ApiError | null;
    if (
      !apiError ||
      apiError.status !== 401 ||
      handledUnauthorizedRef.current
    ) {
      return;
    }

    handledUnauthorizedRef.current = true;
    logout();
  }, [error, logout]);

  useEffect(() => {
    const apiError = error as ApiError | null;
    if (!apiError || apiError.status === 401) {
      return;
    }

    const message = apiError.message || "Erro ao carregar produtos";
    if (lastToastErrorRef.current === message) {
      return;
    }

    lastToastErrorRef.current = message;
    showToast(message, "error");
  }, [error, showToast]);

  useEffect(() => {
    if (!isFetchNextPageError) {
      nextPageErrorToastShownRef.current = false;
      return;
    }

    if (nextPageErrorToastShownRef.current) {
      return;
    }

    nextPageErrorToastShownRef.current = true;
    showToast("Erro ao carregar mais produtos.", "error");
  }, [isFetchNextPageError, showToast]);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const sortedProducts = useMemo(
    () => sortProducts(products, sortBy),
    [products, sortBy],
  );

  const favoriteCodesSet = useMemo(
    () => new Set(favoriteCodes),
    [favoriteCodes],
  );

  const visibleProducts = useMemo(() => {
    if (!showFavoritesOnly) {
      return sortedProducts;
    }

    return sortedProducts.filter((product) =>
      favoriteCodesSet.has(product.codigo),
    );
  }, [favoriteCodesSet, showFavoritesOnly, sortedProducts]);

  const hasActiveSearch = Boolean(debouncedSearchName || debouncedSearchCode);

  const emptyMessage = useMemo(() => {
    if (showFavoritesOnly && hasActiveSearch) {
      return "Nenhum produto favorito encontrado para os filtros informados.";
    }

    if (showFavoritesOnly) {
      return "Nenhum produto favorito encontrado.";
    }

    if (hasActiveSearch) {
      return "Nenhum produto encontrado para os filtros informados.";
    }

    return "Nenhum produto encontrado.";
  }, [hasActiveSearch, showFavoritesOnly]);

  const toggleFavorite = useCallback((productCode: string) => {
    setFavoriteCodes((current) => {
      if (current.includes(productCode)) {
        return current.filter((code) => code !== productCode);
      }

      return [...current, productCode];
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteCodes));
  }, [favoriteCodes]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isPending || isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isPending],
  );
  const retryProducts = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (isPending)
    return (
      <main className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <ProductsSkeletonGrid items={SKELETON_ITEMS} />
      </main>
    );

  if (error)
    return (
      <main className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <ProductsErrorState
          buttonLabel="Tentar novamente"
          onRetry={retryProducts}
          className="flex flex-col w-full"
        />
      </main>
    );

  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <ProductsToolbar
        searchName={searchName}
        searchCode={searchCode}
        showFavoritesOnly={showFavoritesOnly}
        sortBy={sortBy}
        onSearchNameChange={setSearchName}
        onSearchCodeChange={setSearchCode}
        onSortChange={setSortBy}
        onShowFavoritesOnlyChange={setShowFavoritesOnly}
      />
      <section className=" w-full md:w-4/5 grid grid-cols-1 md:grid-cols-5 p-3 gap-3 mx-auto">
        {visibleProducts.map((product: Product) => (
          <ProductCard
            key={product.codigo}
            nome={product.nome}
            codigo={product.codigo}
            descricao={product.descricao}
            preco={product.preco}
            imagem={product.imagem}
            onOpenDetails={() => setSelectedProduct(product)}
            isFavorite={favoriteCodesSet.has(product.codigo)}
            onToggleFavorite={() => toggleFavorite(product.codigo)}
          />
        ))}
      </section>
      {visibleProducts.length === 0 && !isFetchingNextPage && (
        <p className="text-center text-gray-600 pb-6">{emptyMessage}</p>
      )}

      <div ref={lastProductRef} className="h-12 w-full" />

      {isFetchingNextPage && (
        <ProductsSkeletonGrid items={PAGINATION_SKELETON_ITEMS} />
      )}

      {isFetchNextPageError && (
        <div className="flex flex-col items-center gap-2 pb-6">
          <p className="text-sm text-red-600">
            Erro ao carregar mais produtos.
          </p>
          <button
            onClick={retryProducts}
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <ProductDetailsModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
