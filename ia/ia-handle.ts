import { principalPrompt } from "./ia-config";
import { OpenRouter } from "@openrouter/sdk";
import { getFromLocalStorage } from "@/lib/local-storage";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type PromptMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "openrouter/free";

const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

const createAnalysisPrompt = async (
  apiKey: string,
  vpsId?: string | null,
): Promise<PromptMessage[]> => {
  const metrics = getFromLocalStorage("metrics");

  let systemContent = principalPrompt;

  if (!apiKey) {
    systemContent +=
      "\n\nNo se proporcionó una API key, por lo que no se pueden mostrar métricas de VPS.";
  }

  if (metrics) {
    const metricsString = JSON.stringify(metrics, null, 2);
    const contextLabel = vpsId
      ? `métricas de la VPS ${vpsId} de los últimos 7 días`
      : "métricas de todas las VPS disponibles";

    systemContent += `\n\nAquí están las ${contextLabel}:\n${metricsString}`;
  }

  return [
    {
      role: "system",
      content: systemContent,
    },
  ];
};

export async function streamChat(params: {
  messages: ChatMessage[];
  apiKey: string;
  vpsId?: string | null;
  onChunk: (chunk: string) => void;
}) {
  const { messages, apiKey, vpsId, onChunk } = params;
  const systemMessages = await createAnalysisPrompt(apiKey, vpsId);

  const payloadMessages: PromptMessage[] = [
    ...systemMessages,
    ...messages.map(
      (message): PromptMessage => ({
        role: message.role,
        content: message.content,
      }),
    ),
  ];

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_OPENROUTER_API_KEY. Configuralo en .env.local",
    );
  }

  const stream = await openrouter.chat.send({
    chatGenerationParams: {
      model: OPENROUTER_MODEL,
      messages: payloadMessages,
      stream: true,
    },
  });

  let response = "";
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      response += content;
      onChunk(content);
    }
  }

  return response;
}
