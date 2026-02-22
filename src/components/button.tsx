import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className="font-medium text-gray-800 bg-white py-2 px-8 h-14 rounded-4xl"
      {...props}
    >
      {props.children}
    </button>
  );
}
