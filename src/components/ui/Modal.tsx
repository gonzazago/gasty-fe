import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  type?: "success" | "error";
  children: ReactNode;
}

export default function Modal({ open, onClose, type = "success", children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 w-full max-w-xs sm:max-w-sm shadow-xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-2 rounded hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <span className="text-lg">×</span>
        </button>
        <div className="flex flex-col items-center">
          {type === "success" ? (
            <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
              ✓
            </span>
          ) : type === "error" ? (
            <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
              !
            </span>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
