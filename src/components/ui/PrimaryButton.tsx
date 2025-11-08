import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  iconLeft?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function PrimaryButton({
  children,
  iconLeft,
  className,
  ...props
}: Props) {
  return (
    <button
      className={className
        ? twMerge(
            `flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-base
             transition-colors active:bg-purple-800 hover:bg-purple-700
             ring-2 ring-purple-200 hover:ring-purple-300 focus:outline-none
             disabled:bg-gray-300 disabled:cursor-not-allowed`,
            className
          )
        : `flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-base
           transition-colors active:bg-purple-800 hover:bg-purple-700
           ring-2 ring-purple-200 hover:ring-purple-300 focus:outline-none
           disabled:bg-gray-300 disabled:cursor-not-allowed`
      }
      {...props}
    >
      {iconLeft && <span className="text-xl flex">{iconLeft}</span>}
      {children}
    </button>
  );
}
