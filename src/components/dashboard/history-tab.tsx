import { Card, CardContent } from "@/components/ui/card"
import HistoryItem from "./history-item"
import { useEffect, useState } from "react"
import { mockChatSessions, type ChatSession } from "@/mocks/chat-history"
import { useSessionDeletion } from "@/hooks/useSessionDeletion"
import { axiosInstance } from "@/lib/axios"

export default function HistoryTab() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const { deleteSession } = useSessionDeletion({
    onSuccess: () => {
      // The success toast is handled by the hook
    }
  })

  const fetchSessions = async () => {
    try {
      const { data } = await axiosInstance.get<ChatSession[]>("/session")
      setSessions(data.map(session => ({
        ...session,
        createdAt: session.createdAt
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
    await deleteSession(sessionId)
    setSessions(prev => prev.filter(session => session.id !== sessionId))
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