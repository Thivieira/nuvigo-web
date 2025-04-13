import { useCallback } from 'react';
import { useToast } from './use-toast';
import { axiosInstance } from '@/lib/axios';
import { useChatSessions } from './useChat';

interface UseSessionDeletionOptions {
  onSuccess?: () => void;
}

export function useSessionDeletion({ onSuccess }: UseSessionDeletionOptions = {}) {
  const { toast } = useToast();
  const { mutate: mutateSessions } = useChatSessions();

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await axiosInstance.delete(`/session/${sessionId}`);

      // Trigger a refresh of the chat sessions list
      await mutateSessions();

      toast({
        title: 'Sucesso',
        description: 'Conversa excluída com sucesso',
        type: 'success'
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao excluir a conversa',
        type: 'error'
      });
    }
  }, [toast, mutateSessions, onSuccess]);

  return {
    deleteSession,
  };
} 