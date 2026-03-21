function LoadingSection() {
  return (
    <div className="flex items-center justify-center">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-zinc-700 dark:border-t-zinc-200"
        aria-hidden="true"
      />
    </div>
  );
}

export default LoadingSection;
