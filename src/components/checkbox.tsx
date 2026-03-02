import { CheckIcon } from "lucide-react";

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
          {checked && <CheckIcon className="w-3.75 h-3.75 text-white" />}
        </div>
        {label}
      </label>
    </div>
  );
}
