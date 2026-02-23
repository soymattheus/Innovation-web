"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Product } from "@/types/product";

type ProductDetailsModalProps = {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
};

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const IMAGE_FALLBACK_SRC = "/product-placeholder.svg";

export default function ProductDetailsModal({
  isOpen,
  product,
  onClose,
}: ProductDetailsModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusedElementRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        aria-describedby="product-details-description"
        className="w-full max-w-lg rounded-lg bg-white p-5 text-black shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="product-details-title" className="text-xl font-bold">
          {product.nome}
        </h2>
        <p id="product-details-description" className="mt-1 text-sm text-gray-700">
          Cód: {product.codigo}
        </p>

        <div className="mt-4 flex justify-center">
          <Image
            src={product.imagem || IMAGE_FALLBACK_SRC}
            alt={product.nome}
            width={220}
            height={220}
            className="rounded-md"
            onError={(event) => {
              const imageElement = event.currentTarget;
              if (imageElement.dataset.fallbackApplied === "true") {
                return;
              }

              imageElement.dataset.fallbackApplied = "true";
              imageElement.src = IMAGE_FALLBACK_SRC;
            }}
          />
        </div>

        <p className="mt-4 text-sm">{product.descricao}</p>
        <p className="mt-3 text-lg font-semibold">
          {brlFormatter.format(Number(product.preco))}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#59BC04] px-4 py-2 font-semibold text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
