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
  const response = await fetch(`${API_URL}/chat/sessions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao obter sessões de chat');
  }

  return response.json();
};

/**
 * Gets a specific chat session by ID
 */
export const getChatSession = async (accessToken: string, sessionId: string): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao obter sessão de chat');
  }

  return response.json();
};

/**
 * Creates a new chat message
 */
export const createChatMessage = async (
  accessToken: string,
  data: {
    chatSessionId: string;
    location: string;
    temperature: string;
    condition: string;
    naturalResponse: string;
  }
): Promise<ChatMessage> => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao criar mensagem de chat');
  }

  return response.json();
};

/**
 * Gets a specific chat message by ID
 */
export const getChatMessage = async (accessToken: string, messageId: string): Promise<ChatMessage> => {
  const response = await fetch(`${API_URL}/chat/${messageId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao obter mensagem de chat');
  }

  return response.json();
};

/**
 * Updates a chat message
 */
export const updateChatMessage = async (
  accessToken: string,
  messageId: string,
  data: {
    location?: string;
    temperature?: string;
    condition?: string;
    naturalResponse?: string;
  }
): Promise<ChatMessage> => {
  const response = await fetch(`${API_URL}/chat/${messageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao atualizar mensagem de chat');
  }

  return response.json();
};

/**
 * Deletes a chat message
 */
export const deleteChatMessage = async (accessToken: string, messageId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/chat/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao excluir mensagem de chat');
  }
};

/**
 * Deletes a chat session
 */
export const deleteChatSession = async (accessToken: string, sessionId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao excluir sessão de chat');
  }
}; 