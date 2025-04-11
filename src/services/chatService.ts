import { axiosInstance } from '../lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Chat message type
export interface ChatMessage {
  id: string;
  chatSessionId: string;
  location: string;
  temperature: string;
  condition: string;
  naturalResponse: string;
  createdAt: string;
  updatedAt: string;
}

// Create chat message request type
export interface CreateChatMessageRequest {
  chatSessionId: string;
  location: string;
  temperature: string;
  condition: string;
  naturalResponse: string;
}

// Update chat message request type
export interface UpdateChatMessageRequest {
  location?: string;
  temperature?: string;
  condition?: string;
  naturalResponse?: string;
}

/**
 * Gets all chat sessions for the current user
 */
export const getChatSessions = async (accessToken: string): Promise<ChatSession[]> => {
  try {
    const { data } = await axiosInstance.get<ChatSession[]>('/chat/sessions', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao obter sessões de chat');
  }
};

/**
 * Gets a specific chat session by ID
 */
export const getChatSession = async (accessToken: string, sessionId: string): Promise<ChatSession> => {
  try {
    const { data } = await axiosInstance.get<ChatSession>(`/chat/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao obter sessão de chat');
  }
};

/**
 * Creates a new chat message
 */
export const createChatMessage = async (
  accessToken: string,
  data: CreateChatMessageRequest
): Promise<ChatMessage> => {
  try {
    const { data: responseData } = await axiosInstance.post<ChatMessage>('/chat', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return responseData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao criar mensagem de chat');
  }
};

/**
 * Gets a specific chat message by ID
 */
export const getChatMessage = async (accessToken: string, messageId: string): Promise<ChatMessage> => {
  try {
    const { data } = await axiosInstance.get<ChatMessage>(`/chat/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao obter mensagem de chat');
  }
};

/**
 * Updates a chat message
 */
export const updateChatMessage = async (
  accessToken: string,
  messageId: string,
  data: UpdateChatMessageRequest
): Promise<ChatMessage> => {
  try {
    const { data: responseData } = await axiosInstance.put<ChatMessage>(`/chat/${messageId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return responseData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao atualizar mensagem de chat');
  }
};

/**
 * Deletes a chat message
 */
export const deleteChatMessage = async (accessToken: string, messageId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/chat/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao excluir mensagem de chat');
  }
};

/**
 * Deletes a chat session
 */
export const deleteChatSession = async (accessToken: string, sessionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/chat/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao excluir sessão de chat');
  }
}; 