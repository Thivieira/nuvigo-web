import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import dayjs from "@/lib/dayjs"
import type { ChatSession } from "@/mocks/chat-history"
import Link from "next/link"
interface HistoryItemProps {
  session: ChatSession
  onDelete: (sessionId: string) => void
}

export default function HistoryItem({ session, onDelete }: HistoryItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <Link href={`/dashboard/chat/${session.id}`} className="cursor-pointer" title="Abrir conversa">
          <h3 className="font-medium">{session.title}</h3>
          <p className="text-sm text-muted-foreground">
            Última atualização: {dayjs(session.updatedAt).format("DD/MM/YYYY HH:mm")}
          </p>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(session.id)}
          title="Excluir conversa"
          className="text-muted-foreground hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
} 