const colorRows = [
  ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"],
  ["bg-black", "bg-gray-500", "bg-white border border-gray-300", "bg-orange-500"],
  ["bg-amber-800", "bg-amber-950", "bg-blue-950 border border-gray-300", "bg-orange-200"],
];

export default function ProductColors() {
  return (
    <>
      {colorRows.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full flex gap-2 mt-2 items-start">
          {row.map((colorClass, colorIndex) => (
            <div
              key={colorIndex}
              className={`w-4 h-4 rounded-full ${colorClass}`}
              aria-hidden="true"
            />
          ))}
        </div>
      ))}
    </>
  );
}
