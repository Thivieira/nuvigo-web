import { useSwrApiWithError } from './useSwrApi';
import {
  ChatSession,
  ChatMessage,
  createChatMessage,
  updateChatMessage,
  deleteChatMessage,
  deleteChatSession
} from '@/services';

// Hook for fetching all chat sessions
export function useChatSessions() {
  return useSwrApiWithError<ChatSession[]>('/session');
}

// Hook for fetching a single chat session by ID
export function useChatSession(id: string | null) {
  return useSwrApiWithError<ChatSession>(id ? `/session/${id}` : null);
}

// Hook for fetching a single chat message by ID
export function useChatMessage(id: string | null) {
  return useSwrApiWithError<ChatMessage>(id ? `/chat/${id}` : null);
}

// Hook for chat operations
export function useChatOperations() {
  return {
    createChatMessage,
    updateChatMessage,
    deleteChatMessage,
    deleteChatSession,
  };
} 