"use client";

import Image from "next/image";
import ProductColors from "./productColors";
import { Product } from "@/types/product";

type ProductCardProps = Product & {
  onOpenDetails: () => void;
};

export default function ProductCard({
  nome,
  codigo,
  descricao,
  preco,
  imagem,
  onOpenDetails,
}: ProductCardProps) {
  return (
    <article className="flex flex-col text-black h-fit gap-3">
      <div>
        <h1 className="font-bold text-black text-center">{nome}</h1>
        <p className="text-black text-center text-sm">{codigo}</p>
      </div>

      <div className="flex flex-col border border-gray-400 rounded-sm items-center justify-center p-3">
        <p className="text-blue-500 font-bold w-full text-end">EXCLUSIVO!</p>

        <Image src={imagem} alt={nome} width={200} height={200} />

        <p className="text-black text-sm h-14 line-clamp-2">{descricao}</p>

        <p className="w-full text-sm text-start mt-3">Cores:</p>

        <ProductColors />

        <div className="flex flex-col items-end text-sm">
          <p>a partir de</p>
          <p className="text-xl font-bold">
            R${" "}
            {preco.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
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
