import { useState } from "react";
import { Bot } from "lucide-react";
import ChatWindow from "./ChatWindow";

interface ChatWidgetProps {
  buildId?: string;
}

export default function ChatWidget({ buildId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-card border border-border rounded-lg shadow-xl flex flex-col">
          <ChatWindow buildId={buildId} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
