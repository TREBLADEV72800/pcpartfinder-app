import { useState } from "react";
import { ChatMessage } from "@interfaces/chat";

const API_BASE = "/api";

export function useChat() {
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async (message: string, buildId?: string): Promise<ChatMessage | null> => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: sessionId || undefined,
          buildId,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setSessionId(data.sessionId);

      return {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: data.message,
        timestamp: new Date(),
        tokensUsed: data.tokensUsed,
      };
    } catch (error) {
      console.error("Chat error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    sessionId,
  };
}
