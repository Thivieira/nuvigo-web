import { Card, CardContent } from "@/components/ui/card"
import HistoryItem from "./history-item"
import { useEffect, useState } from "react"
import { mockChatSessions, type ChatSession } from "@/mocks/chat-history"
import { useToast } from "@/components/ui/use-toast"

export default function HistoryTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions")
      if (!response.ok) throw new Error("Failed to fetch sessions")
      const data = await response.json()
      setSessions(data.map((session: any) => ({
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
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete session')
      }

      setSessions(prev => prev.filter(session => session.id !== sessionId))
      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      })
    } catch (error) {
      console.error('Error deleting session:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa. Por favor, tente novamente.",
        variant: "destructive",
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

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">Seu histórico de conversas aparecerá aqui.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <HistoryItem
          key={session.id}
          id={session.id}
          title={session.title}
          location={session.location}
          createdAt={session.createdAt}
          onDelete={() => handleDelete(session.id)}
        />
      ))}
    </div>
  )
} 