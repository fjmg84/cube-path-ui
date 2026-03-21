import { ApiKeyInput } from "@/components/api-key-input";

export default function SettingsPage() {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Settings
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Configura tu API key para consultar los datos de VPS y metricas.
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <ApiKeyInput />
      </div>
    </section>
  );
}
