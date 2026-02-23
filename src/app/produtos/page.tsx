"use client";

import { Product } from "@/types/product";
import Header from "./header";
import ProductCard from "./productCard";
import ProductDetailsModal from "./productDetailsModal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";

type ProductsPage = {
  items: Product[];
  nextPage: number | null;
  hasMore: boolean;
};

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export default function Produtos() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductsPage>({
    queryKey: ["produtos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api/produtos?page=${pageParam}&limit=5`);
      if (!response.ok) {
        throw new Error("Falha ao buscar produtos");
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const sortedProducts = useMemo(() => {
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
  }, [products, sortBy]);

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

  if (isPending)
    return (
      <main className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <section className=" w-full md:w-4/5 grid grid-cols-1 md:grid-cols-5 p-3 gap-3 mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="animate-pulse bg-gray-200 rounded-lg h-14" />

              <div className="animate-pulse bg-gray-200 rounded-lg h-90" />

              <div className="animate-pulse bg-gray-200 rounded-lg h-14" />
            </div>
          ))}
        </section>
      </main>
    );

  if (error)
    return (
      <main className="flex flex-col min-h-screen bg-white text-black">
        <Header />
        <section className="flex flex-col w-full">
          <h1 className="text-2xl font-bold text-center mt-10">
            Erro ao carregar produtos
          </h1>
          <button
            onClick={() => refetch()}
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mx-auto mt-4"
          >
            Tentar novamente
          </button>
        </section>
      </main>
    );

  return (
    <main className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <section className="w-full md:w-4/5 px-3 pt-4 mx-auto">
        <div className="flex items-center justify-end gap-2">
          <label htmlFor="sort-products" className="text-sm font-medium">
            Ordenar por:
          </label>
          <select
            id="sort-products"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="name-asc">Nome (A → Z)</option>
            <option value="name-desc">Nome (Z → A)</option>
            <option value="price-asc">Preço (menor → maior)</option>
            <option value="price-desc">Preço (maior → menor)</option>
          </select>
        </div>
      </section>
      <section className=" w-full md:w-4/5 grid grid-cols-1 md:grid-cols-5 p-3 gap-3 mx-auto">
        {sortedProducts.map((product: Product) => (
          <ProductCard
            key={product.codigo}
            nome={product.nome}
            codigo={product.codigo}
            descricao={product.descricao}
            preco={product.preco}
            imagem={product.imagem}
            onOpenDetails={() => setSelectedProduct(product)}
          />
        ))}
      </section>
      <div ref={lastProductRef} className="h-12 w-full" />

      {isFetchingNextPage && (
        <p className="text-center pb-6 text-sm text-gray-600">
          Carregando mais produtos...
        </p>
      )}

      <ProductDetailsModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
