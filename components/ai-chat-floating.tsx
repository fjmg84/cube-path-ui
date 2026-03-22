"use client";

import { streamChat, type ChatMessage } from "@/ia/ia-handle";
import getMetrics from "@/lib/get-metrics";
import { saveToLocalStorage } from "@/lib/local-storage";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function extractVpsId(pathname: string) {
  const match = pathname.match(/^\/vps\/(\d+)/);
  return match?.[1] ?? null;
}

export function AiChatFloating() {
  const pathname = usePathname();
  const { apiKey } = useApiKeyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola. Soy tu asistente de operaciones de VPS. Puedo analizar el estado de tus métricas y sugerir acciones.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentVpsId = useMemo(() => extractVpsId(pathname), [pathname]);

  useEffect(() => {
    (async () => {
      await getMetrics(apiKey, currentVpsId).then((data) => {
        if (data) {
          saveToLocalStorage("metrics", data);
        }
      });
    })();
  }, [apiKey, currentVpsId]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const value = input.trim();
    if (!value || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: value,
    };

    const historyForModel = [...messages, userMessage];

    setInput("");
    setError(null);
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);

    try {
      await streamChat({
        messages: historyForModel,
        apiKey,
        vpsId: currentVpsId,
        onChunk: (chunk) => {
          setMessages((prev) => {
            if (prev.length === 0) {
              return prev;
            }

            const next = [...prev];
            const lastIndex = next.length - 1;
            const lastMessage = next[lastIndex];

            if (lastMessage.role !== "assistant") {
              return prev;
            }

            next[lastIndex] = {
              ...lastMessage,
              content: `${lastMessage.content}${chunk}`,
            };

            return next;
          });
        },
      });
    } catch (caughtError) {
      console.error("AI chat error:", caughtError);
      setError("No se pudo obtener respuesta de la IA.");
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (
          next[lastIndex]?.role === "assistant" &&
          !next[lastIndex]?.content
        ) {
          next[lastIndex] = {
            role: "assistant",
            content:
              "No pude procesar tu solicitud en este momento. Intenta nuevamente en unos segundos.",
          };
        }

        return next;
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/40"
      >
        <span className="h-2 w-2 rounded-full bg-white/90" />
        IA Asistente
      </button>

      {isOpen && (
        <section className="fixed right-5 bottom-20 z-50 flex h-[70vh] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <header className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Analista IA de VPS
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {currentVpsId
                ? `Contexto actual: VPS #${currentVpsId}`
                : "Sin VPS específico en contexto. Analisis general."}
            </p>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-auto bg-zinc-50/70 p-4 dark:bg-zinc-950/40"
          >
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-sky-500 text-white"
                    : "mr-auto border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                }`}
              >
                {message.content ||
                  (isSending && message.role === "assistant" ? "..." : "")}
              </article>
            ))}
          </div>

          <footer className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
            {error && (
              <p className="mb-2 text-xs text-red-500 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Escribe tu consulta sobre el estado de la VPS..."
                rows={2}
                className="min-h-16 flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-sky-500 transition placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isSending || !input.trim()}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}
