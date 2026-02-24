type ProductsErrorStateProps = {
  title?: string;
  description?: string;
  buttonLabel: string;
  onRetry: () => void;
  className?: string;
};

export default function ProductsErrorState({
  title = "Erro ao carregar produtos",
  description,
  buttonLabel,
  onRetry,
  className,
}: ProductsErrorStateProps) {
  return (
    <section className={className}>
      <h1 className="text-2xl font-bold text-center mt-10">{title}</h1>
      {description ? <p className="text-sm text-center mt-2">{description}</p> : null}
      <button
        onClick={onRetry}
        type="button"
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mx-auto mt-4 block"
      >
        {buttonLabel}
      </button>
    </section>
  );
}
