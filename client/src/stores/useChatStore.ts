import { create } from "zustand";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  tokensInput?: number;
  tokensOutput?: number;
}

interface ChatSession {
  id: string;
  buildId?: string;
  messages: ChatMessage[];
  totalTokens: number;
  isOpen: boolean;
}

interface ChatState {
  currentSession: ChatSession | null;
  isTyping: boolean;

  // Actions
  startSession: (buildId?: string) => void;
  endSession: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setIsTyping: (isTyping: boolean) => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSession: null,
  isTyping: false,

  startSession: (buildId) =>
    set({
      currentSession: {
        id: crypto.randomUUID(),
        buildId,
        messages: [],
        totalTokens: 0,
        isOpen: true,
      },
    }),

  endSession: () => set({ currentSession: null }),

  addMessage: (message) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            messages: [
              ...state.currentSession.messages,
              {
                ...message,
                id: crypto.randomUUID(),
                timestamp: new Date(),
              },
            ],
            totalTokens:
              state.currentSession.totalTokens +
              (message.tokensInput || 0) +
              (message.tokensOutput || 0),
          }
        : null,
    })),

  setIsTyping: (isTyping) => set({ isTyping }),

  toggleChat: () =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, isOpen: !state.currentSession.isOpen }
        : null,
    })),
}));
