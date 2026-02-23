"use client";

import Image from "next/image";
import ProductColors from "./productColors";
import { Product } from "@/types/product";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type ProductCardProps = Product & {
  onOpenDetails: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const IMAGE_FALLBACK_SRC = "/product-placeholder.svg";

export default function ProductCard({
  nome,
  codigo,
  descricao,
  preco,
  imagem,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <article className="flex flex-col text-black h-fit gap-3">
      <div>
        <h1 className="font-bold text-black text-center h-14">{nome}</h1>
        <p className="text-black text-center text-sm">{codigo}</p>
      </div>

      <div className="flex flex-col border border-gray-400 rounded-sm items-center justify-center p-3">
        <div className="flex items-center justify-between w-full">
          <p className="text-blue-500 font-bold">EXCLUSIVO!</p>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remover ${nome} dos favoritos`
                : `Adicionar ${nome} aos favoritos`
            }
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
          </button>
        </div>

        <Image
          src={imagem || IMAGE_FALLBACK_SRC}
          alt={nome}
          width={200}
          height={200}
          onError={(event) => {
            const imageElement = event.currentTarget;
            if (imageElement.dataset.fallbackApplied === "true") {
              return;
            }

            imageElement.dataset.fallbackApplied = "true";
            imageElement.src = IMAGE_FALLBACK_SRC;
          }}
        />

        <p className="text-black text-sm h-14 line-clamp-2">{descricao}</p>

        <p className="w-full text-sm text-start mt-3">Cores:</p>

        <ProductColors />

        <div className="flex flex-col items-end text-sm">
          <p>a partir de</p>
          <p className="text-xl font-bold">
            {brlFormatter.format(Number(preco))}
          </p>
          <p>gerado pela melhor oferta</p>
        </div>
      </div>

      <button
        onClick={onOpenDetails}
        type="button"
        className="bg-[#59BC04] p-2 w-full font-bold text-white rounded-sm"
      >
        CONFIRA
      </button>
    </article>
  );
}
