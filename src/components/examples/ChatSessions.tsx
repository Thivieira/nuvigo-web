import React, { useState } from 'react';
import { useChatSessions, useChatOperations } from '@/hooks';
import { ChatSession } from '@/services';

export function ChatSessions() {
  const { data: sessions, isLoading, error, mutate } = useChatSessions();
  const { deleteChatSession } = useChatOperations();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteChatSession(id);
      // Revalidate the sessions list after deletion
      mutate();
    } catch (error) {
      console.error('Failed to delete chat session:', error);
    }
  };

  if (isLoading) return <div>Loading chat sessions...</div>;
  if (error) return <div>Error loading chat sessions: {error}</div>;
  if (!sessions || sessions.length === 0) return <div>No chat sessions found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Sessions</h2>
      <div className="space-y-4">
        {sessions.map((session: ChatSession) => (
          <div
            key={session.id}
            className={`border p-4 rounded-md flex justify-between items-center ${selectedSession === session.id ? 'bg-blue-50' : ''
              }`}
            onClick={() => setSelectedSession(session.id)}
          >
            <div>
              <h3 className="font-medium">Session {session.id.substring(0, 8)}</h3>
              <p className="text-gray-600">
                Created: {new Date(session.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSession(session.id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 