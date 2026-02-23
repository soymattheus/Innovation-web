export default function ProductColors() {
  return (
    <>
      <div className="w-full flex gap-2 mt-2 items-start">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
      </div>

      <div className="w-full flex gap-2 mt-2 items-start">
        <div className="w-4 h-4 bg-black rounded-full"></div>
        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
        <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
      </div>

      <div className="w-full flex gap-2 mt-2 items-start">
        <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
        <div className="w-4 h-4 bg-amber-950 rounded-full"></div>
        <div className="w-4 h-4 bg-blue-950 border border-gray-300 rounded-full"></div>
        <div className="w-4 h-4 bg-orange-200 rounded-full"></div>
      </div>
    </>
  );
}
