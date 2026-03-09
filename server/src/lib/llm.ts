import OpenAI from "openai";

// Configurazione OpenRouter per modello free
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export const llm = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || OPENROUTER_BASE_URL,
  apiKey: process.env.LLM_API_KEY || "", // Required anche per free
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
    "X-Title": "PCBuilderAI",
  },
});

export const DEFAULT_MODEL = process.env.LLM_MODEL || "openai/gpt-oss-120b:free";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  tokensUsed: number;
  model: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL
): Promise<ChatResponse> {
  const completion = await llm.chat.completions.create({
    model,
    messages,
    max_tokens: 400,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  const tokensUsed = completion.usage?.total_tokens || 0;

  return {
    message: reply,
    tokensUsed,
    model: completion.model,
  };
}
