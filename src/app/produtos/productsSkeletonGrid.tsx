type ProductsSkeletonGridProps = {
  items: number;
};

export default function ProductsSkeletonGrid({ items }: ProductsSkeletonGridProps) {
  return (
    <section className="w-full md:w-4/5 grid grid-cols-1 md:grid-cols-5 p-3 gap-3 mx-auto">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className="animate-pulse bg-gray-200 rounded-lg h-14" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-90" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-14" />
        </div>
      ))}
    </section>
  );
}
