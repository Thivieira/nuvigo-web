"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: Message[];
  onResponse?: (response: AxiosResponse) => void;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
  activeLocation?: string;
}

export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'error';

export function useChat({
  api = '/chat',
  id,
  initialMessages = [],
  onResponse,
  onFinish,
  onError,
  activeLocation,
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!input.trim() || status === 'submitted' || status === 'streaming') {
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setStatus('submitted');

      try {
        const response = await axiosInstance.get('/weather', {
          params: {
            location: activeLocation || 'Rio de Janeiro',
            query: input
          }
        });

        if (onResponse) {
          onResponse(response);
        }

        const { naturalResponse } = response.data;

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: naturalResponse,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStatus('idle');

        if (onFinish) {
          onFinish(assistantMessage);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was aborted, do nothing
          return;
        }

        console.error('Error in chat:', error);
        setStatus('error');

        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [input, status, activeLocation, onResponse, onFinish, onError]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
  };
} 