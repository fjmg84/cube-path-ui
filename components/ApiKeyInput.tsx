"use client";

import { useApiKeyStore } from "@/store/useApiKeyStore";

export function ApiKeyInput() {
  const { apiKey, saveApiKey, removeApiKey } = useApiKeyStore();

  return (
    <>
      <input
        type="text"
        name="apiKey"
        placeholder="Put your API key here"
        value={apiKey}
        onChange={(event) => saveApiKey(event.target.value)}
        className="w-full rounded-md border-2 border-gray-300 bg-transparent px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={removeApiKey}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
      >
        Clear API key
      </button>
    </>
  );
}
