type IncidentsPaginationProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function IncidentsPagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: IncidentsPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-zinc-800">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 1}
        className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200"
      >
        Anterior
      </button>
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Pagina {page} de {totalPages}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200"
      >
        Siguiente
      </button>
    </div>
  );
}
