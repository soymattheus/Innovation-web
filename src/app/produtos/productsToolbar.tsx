"use client";

import { SortOption } from "./products.types";

type ProductsToolbarProps = {
  searchName: string;
  searchCode: string;
  showFavoritesOnly: boolean;
  sortBy: SortOption;
  onSearchNameChange: (value: string) => void;
  onSearchCodeChange: (value: string) => void;
  onShowFavoritesOnlyChange: (checked: boolean) => void;
  onSortChange: (value: SortOption) => void;
};

export default function ProductsToolbar({
  searchName,
  searchCode,
  showFavoritesOnly,
  sortBy,
  onSearchNameChange,
  onSearchCodeChange,
  onShowFavoritesOnlyChange,
  onSortChange,
}: ProductsToolbarProps) {
  return (
    <section className="w-full md:w-4/5 px-3 pt-4 mx-auto">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <label htmlFor="search-name" className="text-sm font-medium">
            Nome:
          </label>
          <input
            id="search-name"
            type="text"
            value={searchName}
            onChange={(event) => onSearchNameChange(event.target.value)}
            placeholder="Buscar por nome"
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          />

          <label htmlFor="search-code" className="text-sm font-medium">
            Código:
          </label>
          <input
            id="search-code"
            type="text"
            value={searchCode}
            onChange={(event) => onSearchCodeChange(event.target.value)}
            placeholder="Buscar por código"
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label
            htmlFor="show-favorites"
            className="text-sm font-medium flex items-center gap-2"
          >
            <input
              id="show-favorites"
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(event) =>
                onShowFavoritesOnlyChange(event.target.checked)
              }
            />
            Mostrar apenas favoritos
          </label>

          <label htmlFor="sort-products" className="text-sm font-medium">
            Ordenar por:
          </label>
          <select
            id="sort-products"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="name-asc">Nome (A → Z)</option>
            <option value="name-desc">Nome (Z → A)</option>
            <option value="price-asc">Preço (menor → maior)</option>
            <option value="price-desc">Preço (maior → menor)</option>
          </select>
        </div>
      </div>
    </section>
  );
}
