"use client";

import { useApiKeyStore } from "@/store/useApiKeyStore";

export function ApiKeyInput() {
  const { apiKey, saveApiKey, removeApiKey } = useApiKeyStore();

  return (
    <div className="flex gap-4">
      <input
        type="text"
        name="apiKey"
        placeholder="Introduce tu API key aquí"
        value={apiKey}
        onChange={(event) => saveApiKey(event.target.value)}
        className="w-full rounded-md border-2 border-gray-300 bg-transparent px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />

      <button
        type="button"
        onClick={removeApiKey}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none hover:cursor-pointer dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      >
        Eliminar API key
      </button>
    </div>
  );
}
