"use client";

import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { chatService } from "@/services/chatService";
import type { ChatMessage, ChatSession } from "@/types/chat";

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoadingSessions: boolean;
  isSending: boolean;
  isTyping: boolean;
  sidebarOpen: boolean;
  error: string | null;

  init: () => Promise<void>;
  selectSession: (id: string) => void;
  newChat: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  isLoadingSessions: true,
  isSending: false,
  isTyping: false,
  sidebarOpen: false,
  error: null,

  init: async () => {
    set({ isLoadingSessions: true, error: null });
    try {
      const sessions = await chatService.getSessions();
      set({
        sessions,
        activeSessionId: sessions[0]?.id ?? null,
        isLoadingSessions: false,
      });
    } catch {
      set({
        isLoadingSessions: false,
        error: "Couldn't load your conversations. Try refreshing.",
      });
    }
  },

  selectSession: (id) => {
    set({ activeSessionId: id, sidebarOpen: false });
  },

  newChat: async () => {
    const session = await chatService.createSession();
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: session.id,
      sidebarOpen: false,
    }));
  },

  deleteSession: async (id) => {
    await chatService.deleteSession(id);
    set((state) => {
      const remaining = state.sessions.filter((s) => s.id !== id);
      const wasActive = state.activeSessionId === id;
      return {
        sessions: remaining,
        activeSessionId: wasActive ? remaining[0]?.id ?? null : state.activeSessionId,
      };
    });
  },

  sendMessage: async (content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    let { activeSessionId } = get();
    if (!activeSessionId) {
      const session = await chatService.createSession();
      set((state) => ({
        sessions: [session, ...state.sessions],
        activeSessionId: session.id,
      }));
      activeSessionId = session.id;
    }

    const sessionId = activeSessionId;

    set((state) => ({
      isSending: true,
      isTyping: true,
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: `optimistic_${Date.now()}`,
                  role: "user" as const,
                  content: trimmed,
                  timestamp: new Date().toISOString(),
                  status: "sending" as const,
                },
              ],
            }
          : s
      ),
    }));

    try {
      const { session } = await chatService.sendMessage(sessionId, trimmed);
      set((state) => ({
        isSending: false,
        isTyping: false,
        sessions: state.sessions.map((s) => (s.id === sessionId ? session : s)),
      }));
    } catch {
      set({ isSending: false, isTyping: false, error: "Message failed to send." });
    }
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));

export function useChat() {
  const {
    sessions,
    activeSessionId,
    isLoadingSessions,
    isSending,
    isTyping,
    error,
    init,
    selectSession,
    newChat,
    deleteSession,
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    if (sessions.length === 0) {
      void init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const messages: ChatMessage[] = activeSession?.messages ?? [];

  return {
    sessions,
    activeSession,
    messages,
    isLoadingSessions,
    isSending,
    isTyping,
    error,
    selectSession,
    newChat,
    deleteSession,
    sendMessage,
  };
}