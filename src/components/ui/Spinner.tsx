export default function Spinner() {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Cargando">
      <svg
        className="animate-spin w-7 h-7 text-purple-600 opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
