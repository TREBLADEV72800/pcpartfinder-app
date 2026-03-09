import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import { useChatStore } from "@stores/useChatStore";
import { useChat as useChatApi } from "@hooks/useChat";

interface ChatWindowProps {
  buildId?: string;
  onClose: () => void;
}

export default function ChatWindow({ buildId, onClose }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, loading } = useChatApi();
  const { currentSession, addMessage } = useChatStore();

  const suggestions = [
    "Quali componenti mi servono per un gaming PC da 1000€?",
    "È compatibile questa scheda video con la mia alimentazione?",
    "Cos'è il TDP di una CPU?",
    "Qual è il socket AMD più recente?",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to store
    addMessage({
      role: "user",
      content: userMessage,
    });

    // Send to API and get response
    const response = await sendMessage(userMessage, buildId);

    if (response) {
      addMessage({
        role: "assistant",
        content: response.content,
        tokensInput: response.tokensUsed,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">BuilderBot AI</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-accent rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Ciao! Sono BuilderBot</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chiedimi qualsiasi cosa su componenti PC e configurazioni.
            </p>

            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Domande suggerite:</p>
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="w-full text-left text-sm px-3 py-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          currentSession.messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm">Sto pensando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Fai una domanda sui componenti PC..."
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by OpenRouter AI • Non sempre accurate
        </p>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system";
    content: string;
    tokensInput?: number;
  };
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.tokensInput && (
          <span className="text-xs opacity-70 mt-1 block">
            {message.tokensInput} token
          </span>
        )}
      </div>
    </div>
  );
}
