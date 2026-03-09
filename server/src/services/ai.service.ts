import { prisma } from "../lib/prisma.js";
import { chatCompletion, type ChatMessage, DEFAULT_MODEL } from "../lib/llm.js";

interface ChatInput {
  sessionId?: string;
  userId?: string;
  buildId?: string;
  message: string;
  model?: string;
}

interface ChatResponse {
  sessionId: string;
  message: string;
  tokensUsed: number;
  model: string;
}

export class AIService {
  async chat(input: ChatInput): Promise<ChatResponse> {
    const { userId, buildId, message, model = DEFAULT_MODEL } = input;

    // Get or create session
    let sessionId = input.sessionId;
    if (!sessionId) {
      const session = await prisma.chatSession.create({
        data: {
          userId,
          buildId,
          modelUsed: model,
        },
      });
      sessionId = session.id;
    }

    // Get build context if buildId provided
    let buildContext = "";
    if (buildId) {
      const build = await prisma.build.findUnique({
        where: { id: buildId },
        include: {
          items: {
            include: {
              component: true,
            },
          },
        },
      });

      if (build) {
        buildContext = build.items
          .map((i) => `- ${i.categorySlot}: ${i.component.name}`)
          .join("\n");
      }
    }

    // Get recent message history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    // Build messages array
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: this.buildSystemPrompt(buildContext),
      },
      ...history.map((m) => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call LLM
    const response = await chatCompletion(messages, model);

    // Save messages
    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId,
          role: "USER",
          content: message,
        },
        {
          sessionId,
          role: "ASSISTANT",
          content: response.message,
          tokensInput: response.tokensUsed,
        },
      ],
    });

    // Update session token count
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        totalTokens: { increment: response.tokensUsed },
        modelUsed: response.model,
      },
    });

    return {
      sessionId,
      message: response.message,
      tokensUsed: response.tokensUsed,
      model: response.model,
    };
  }

  private buildSystemPrompt(buildContext?: string): string {
    const basePrompt = `Sei un assistente esperto nella configurazione di PC desktop.
Il tuo nome è BuilderBot.

REGOLE:
- Rispondi SOLO a domande relative alla configurazione/assemblaggio PC.
- Se l'utente chiede qualcosa fuori tema, rifiuta educatamente.
- Suggerisci componenti specifici quando possibile.
- Considera sempre la compatibilità tra componenti.
- Tieni conto del budget se menzionato.
- Rispondi nella lingua dell'utente (italiano o inglese).
- Sii conciso: max 150 parole per risposta.
- Non inventare specifiche: se non sei sicuro, dillo.

DATABASE: Contiene solo componenti dal 2019 in poi.`;

    if (buildContext) {
      return `${basePrompt}\n\nCONFIGURAZIONE ATTUALE DELL'UTENTE:\n${buildContext}`;
    }

    return basePrompt;
  }

  async getSessionHistory(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  async deleteSession(sessionId: string, userId?: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new Error("Session not found");
    if (userId && session.userId !== userId) throw new Error("Unauthorized");

    await prisma.chatMessage.deleteMany({
      where: { sessionId },
    });

    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return { success: true };
  }
}

export const aiService = new AIService();
