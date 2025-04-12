import { History } from "lucide-react"
import Link from "next/link"
import dayjs from "@/lib/dayjs"
import { useChatSessions } from "@/hooks/useChat"
import { ChatSession } from "@/services/chatService"

export default function RecentConversations() {
  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions()

  if (isLoadingSessions) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <History className="h-4 w-4" />
          CONVERSAS RECENTES
        </h3>
        <div className="text-sm text-muted-foreground p-2">Carregando...</div>
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
        <History className="h-4 w-4" />
        CONVERSAS RECENTES
      </h3>
      <div className="space-y-2">
        {sessions.slice(0, 5).map((session: ChatSession) => (
          <Link
            key={session.id}
            href={`/dashboard/chat/${session.id}`}
            className="block p-2 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <p className="text-sm font-medium">{session.title}</p>
            <p className="text-xs text-muted-foreground">
              {dayjs(session.createdAt).format('DD/MM, HH:mm')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 