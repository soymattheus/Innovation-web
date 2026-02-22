import type { ComponentProps } from "react";

interface InputRootProps extends ComponentProps<"div"> {
  error?: boolean;
}

export function InputRoot({ error = false, ...props }: InputRootProps) {
  return (
    <div
      data-error={error}
      className="group w-full bg-white h-14 border border-white rounded-4xl px-4 flex items-center gap-2 focus-within:border-white data-[error=true]:border-red-600"
      {...props}
    />
  );
}

export function InputIcon({ ...props }: ComponentProps<"span">) {
  return (
    <span
      className="text-gray-800 group-focus-within:text-gray-800 group-[&:not(:has(input:placeholder-shown))]:text-gray-800 group-data-[error=true]:text-red-600"
      {...props}
    />
  );
}

export function InputField({ ...props }: ComponentProps<"input">) {
  return (
    <input
      className="flex-1 outline-0 placeholder-gray-700 text-gray-700"
      {...props}
    />
  );
}
