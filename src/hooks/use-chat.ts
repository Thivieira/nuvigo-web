"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: Message[];
  onResponse?: (response: Response) => void;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'error';

export function useChat({
  api = '/api/chat',
  id,
  initialMessages = [],
  onResponse,
  onFinish,
  onError,
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
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController();

        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            id,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (onResponse) {
          onResponse(response);
        }

        setStatus('streaming');

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        const decoder = new TextDecoder();
        let assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '',
        };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id ? { ...assistantMessage } : msg
            )
          );
        }

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
    [api, id, input, messages, onError, onFinish, onResponse, status]
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
  };
} 