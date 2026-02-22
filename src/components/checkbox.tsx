export default function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex flex-row">
      <input
        type="checkbox"
        name="checkbox"
        id="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        className="appearance-none"
      />
      <label
        htmlFor="checkbox"
        className="flex flex-row items-center gap-2 cursor-pointer"
      >
        <div className="w-4 h-4 border border-white rounded-sm">
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-check-icon lucide-check"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </div>
        {label}
      </label>
    </div>
  );
}
