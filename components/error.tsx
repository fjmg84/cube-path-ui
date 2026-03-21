export default function ErrorComponent({ error }: { error: string }) {
  return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
}
