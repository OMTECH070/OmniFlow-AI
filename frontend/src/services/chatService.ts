import { mockDelay } from "@/lib/api";
import { generateId } from "@/lib/utils";
import { ChatMessage, ChatSession } from "@/types/chat";

function nowIso(): string {
  return new Date().toISOString();
}

const MOCK_REPLIES: string[] = [
  "Here's a quick summary:\n\n- Point one explained simply\n- Point two with **bold** emphasis\n- Point three with `inline code`\n\nLet me know if you'd like more detail.",
  "That's a good question. In short:\n\n1. Break the problem down\n2. Identify the core logic\n3. Test with edge cases\n\n```\nfunction add(a, b) {\n  return a + b;\n}\n```",
  "Sure! Here's what I found:\n\n**Key takeaway:** consistency matters more than perfection.\n\nYou can read more [here](https://example.com).",
  "Good point. A few things worth considering:\n\n- Keep the scope small\n- Ship, then iterate\n- Get feedback early",
];

function pickReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

function seedSession(): ChatSession {
  return {
    id: generateId(),
    title: "Welcome chat",
    updatedAt: nowIso(),
    messages: [
      {
        id: generateId(),
        role: "assistant",
        content: "Hi! I'm your assistant. Ask me anything to get started.",
        timestamp: nowIso(),
        status: "sent",
      },
    ],
  };
}

export const chatService = {
  async fetchSessions(): Promise<ChatSession[]> {
    return mockDelay([seedSession()], 500);
  },

  async createSession(): Promise<ChatSession> {
    const session: ChatSession = {
      id: generateId(),
      title: "New chat",
      updatedAt: nowIso(),
      messages: [],
    };
    return mockDelay(session, 250);
  },

  async deleteSession(sessionId: string): Promise<{ id: string }> {
    return mockDelay({ id: sessionId }, 200);
  },

  async sendMessage(
    _sessionId: string,
    _content: string
  ): Promise<ChatMessage> {
    const reply: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: pickReply(),
      timestamp: nowIso(),
      status: "sent",
    };
    return mockDelay(reply, 1000 + Math.random() * 800);
  },
};