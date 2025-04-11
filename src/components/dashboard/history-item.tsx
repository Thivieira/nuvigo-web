import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import dayjs from "@/lib/dayjs"
import type { ChatSession } from "@/mocks/chat-history"

interface HistoryItemProps {
  session: ChatSession
  onDelete: (sessionId: string) => void
}

export default function HistoryItem({ session, onDelete }: HistoryItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{session.title}</h3>
          <p className="text-sm text-muted-foreground">
            {dayjs(session.createdAt).format("LL")}
          </p>
          {session.location && (
            <p className="text-sm text-muted-foreground mt-1">
              {session.location}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(session.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
} 