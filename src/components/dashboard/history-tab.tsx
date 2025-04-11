import { Card, CardContent } from "@/components/ui/card"
import HistoryItem from "./history-item"
import { useEffect, useState } from "react"
import { mockChatSessions, type ChatSession } from "@/mocks/chat-history"
import { useToast } from "@/hooks/use-toast"
import { axiosInstance } from "@/lib/axios"

export default function HistoryTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      const { data } = await axiosInstance.get<ChatSession[]>("/api/chat/sessions")
      setSessions(data.map(session => ({
        ...session,
        createdAt: new Date(session.createdAt)
      })))
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
      // Fallback to mock data if API call fails
      setSessions(mockChatSessions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleDelete = async (sessionId: string) => {
    try {
      await axiosInstance.delete(`/api/chat/sessions/${sessionId}`)
      setSessions(prev => prev.filter(session => session.id !== sessionId))
      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
        type: "success"
      })
    } catch (error) {
      console.error('Error deleting session:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa. Por favor, tente novamente.",
        type: "error"
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">Carregando histórico...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma conversa encontrada.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <HistoryItem
                key={session.id}
                session={session}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 