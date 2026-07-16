import { generateId, jitteredDelay } from "@/lib/api";
import type { ChatMessage, ChatSession, SendMessageResult } from "@/types/chat";

const MOCK_REPLIES = [
  "Here's a quick breakdown based on what you shared — happy to go deeper on any part of it.",
  "Good question. Let's walk through it step by step so nothing gets lost.",
  "I put together a few options here — let me know which direction feels right.",
  "That's a reasonable approach. One thing worth double-checking: the edge cases around empty input.",
  "Here's a possible structure:\n\n1. Define the goal\n2. Sketch the approach\n3. Validate with a small example\n\nWant me to expand any of these?",
  "```ts\nfunction sum(a: number, b: number) {\n  return a + b;\n}\n```\n\nThat's a minimal example — adjust the types to fit your case.",
  "Noted! I'll keep that context in mind for the rest of this conversation.",
  "There are a couple of trade-offs worth naming before we commit to one path.",
];

function pickReply(): string {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

function titleFromContent(content: string): string {
  const words = content.trim().split(/\s+/).slice(0, 6).join(" ");
  return words.length > 0 ? words : "New conversation";
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: generateId("msg"),
    role,
    content,
    timestamp: nowIso(),
    status: "sent",
  };
}

function seedSession(title: string, ageMinutes: number): ChatSession {
  const createdAt = new Date(Date.now() - ageMinutes * 60_000).toISOString();
  return {
    id: generateId("session"),
    title,
    createdAt,
    updatedAt: createdAt,
    messages: [],
  };
}

let sessions: ChatSession[] = [
  {
    ...seedSession("Refactor the auth middleware", 40),
    messages: [
      makeMessage("user", "Can you help me refactor this auth middleware to use async/await?"),
      makeMessage(
        "assistant",
        "Sure — the cleanest way is to wrap the callback in a promise once, then `await` it everywhere else. Want me to sketch that out?"
      ),
    ],
  },
  seedSession("Weekly report summary ideas", 180),
  seedSession("Explain vector databases", 60 * 24),
  seedSession("Landing page copy pass", 60 * 24 * 3),
];

function touch(session: ChatSession) {
  session.updatedAt = nowIso();
}

function findSessionOrThrow(sessionId: string): ChatSession {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error(`Unknown session: ${sessionId}`);
  }
  return session;
}

export const chatService = {
  async getSessions(): Promise<ChatSession[]> {
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return jitteredDelay(structuredClone(sorted), 350, 750);
  },

  async getSession(sessionId: string): Promise<ChatSession> {
    const session = findSessionOrThrow(sessionId);
    return jitteredDelay(structuredClone(session), 150, 350);
  },

  async createSession(): Promise<ChatSession> {
    const session = seedSession("New conversation", 0);
    sessions = [session, ...sessions];
    return jitteredDelay(structuredClone(session), 150, 350);
  },

  async deleteSession(sessionId: string): Promise<{ id: string }> {
    sessions = sessions.filter((s) => s.id !== sessionId);
    return jitteredDelay({ id: sessionId }, 150, 350);
  },

  async sendMessage(sessionId: string, content: string): Promise<SendMessageResult> {
    const session = findSessionOrThrow(sessionId);

    const userMessage = makeMessage("user", content);
    session.messages.push(userMessage);
    if (session.messages.length === 1) {
      session.title = titleFromContent(content);
    }
    touch(session);

    const assistantMessage = makeMessage("assistant", pickReply());
    await jitteredDelay(null, 900, 1900);
    session.messages.push(assistantMessage);
    touch(session);

    return structuredClone({ userMessage, assistantMessage, session });
  },
};