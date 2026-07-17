"use client";

import { useEffect, useCallback } from "react";
import { create } from "zustand";
import { chatService } from "@/services/chatService";
import { generateId } from "@/lib/utils";
import { ChatMessage, ChatSession } from "@/types/chat";

export type View = "chat" | "dashboard" | "settings";

export interface AppUser {
  name: string;
  role: string;
}

interface ChatStoreState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoadingSessions: boolean;
  isSending: boolean;
  isTyping: boolean;
  sidebarOpen: boolean;
  currentView: View;
  user: AppUser;

  setSessions: (sessions: ChatSession[]) => void;
  setActiveSessionId: (id: string | null) => void;
  addSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;
  appendMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessageStatus: (
    sessionId: string,
    messageId: string,
    status: ChatMessage["status"]
  ) => void;
  setLoadingSessions: (value: boolean) => void;
  setSending: (value: boolean) => void;
  setTyping: (value: boolean) => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setView: (view: View) => void;
  setUser: (user: AppUser) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  sessions: [],
  activeSessionId: null,
  isLoadingSessions: true,
  isSending: false,
  isTyping: false,
  sidebarOpen: false,
  currentView: "chat",
  user: { name: "Aditi Kulkarni", role: "Frontend workspace" },

  setSessions: (sessions) =>
    set({ sessions, activeSessionId: sessions[0]?.id ?? null }),

  setActiveSessionId: (id) => set({ activeSessionId: id, currentView: "chat" }),

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: session.id,
      currentView: "chat",
    })),

  removeSession: (id) =>
    set((state) => {
      const sessions = state.sessions.filter((s) => s.id !== id);
      const activeSessionId =
        state.activeSessionId === id
          ? sessions[0]?.id ?? null
          : state.activeSessionId;
      return { sessions, activeSessionId };
    }),

  appendMessage: (sessionId, message) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: message.timestamp,
            }
          : session
      ),
    })),

  updateMessageStatus: (sessionId, messageId, status) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: session.messages.map((m) =>
                m.id === messageId ? { ...m, status } : m
              ),
            }
          : session
      ),
    })),

  setLoadingSessions: (value) => set({ isLoadingSessions: value }),
  setSending: (value) => set({ isSending: value }),
  setTyping: (value) => set({ isTyping: value }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),

  setView: (view) => set({ currentView: view }),
  setUser: (user) => set({ user }),
}));

export function useChat() {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const isLoadingSessions = useChatStore((s) => s.isLoadingSessions);
  const isSending = useChatStore((s) => s.isSending);
  const isTyping = useChatStore((s) => s.isTyping);

  const setSessions = useChatStore((s) => s.setSessions);
  const setActiveSessionId = useChatStore((s) => s.setActiveSessionId);
  const addSession = useChatStore((s) => s.addSession);
  const removeSession = useChatStore((s) => s.removeSession);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const setLoadingSessions = useChatStore((s) => s.setLoadingSessions);
  const setSending = useChatStore((s) => s.setSending);
  const setTyping = useChatStore((s) => s.setTyping);
  const closeSidebar = useChatStore((s) => s.closeSidebar);

  useEffect(() => {
    let mounted = true;
    setLoadingSessions(true);
    chatService
      .fetchSessions()
      .then((data) => {
        if (mounted) setSessions(data);
      })
      .finally(() => {
        if (mounted) setLoadingSessions(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];

  const newChat = useCallback(async () => {
    const session = await chatService.createSession();
    addSession(session);
    closeSidebar();
  }, [addSession, closeSidebar]);

  const selectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      closeSidebar();
    },
    [setActiveSessionId, closeSidebar]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      await chatService.deleteSession(id);
      removeSession(id);
    },
    [removeSession]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let sessionId = activeSessionId;
      if (!sessionId) {
        const session = await chatService.createSession();
        addSession(session);
        sessionId = session.id;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
        status: "sending",
      };
      appendMessage(sessionId, userMessage);
      setSending(true);

      const typingDelay = setTimeout(() => setTyping(true), 300);

      try {
        const reply = await chatService.sendMessage(sessionId, content);
        updateMessageStatus(sessionId, userMessage.id, "sent");
        appendMessage(sessionId, reply);
      } finally {
        clearTimeout(typingDelay);
        setTyping(false);
        setSending(false);
      }
    },
    [
      activeSessionId,
      addSession,
      appendMessage,
      setSending,
      setTyping,
      updateMessageStatus,
    ]
  );

  return {
    sessions,
    activeSession,
    messages,
    isLoadingSessions,
    isSending,
    isTyping,
    sendMessage,
    newChat,
    selectSession,
    deleteSession,
  };
}