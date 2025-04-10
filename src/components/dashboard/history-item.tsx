import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import dayjs from "@/lib/dayjs"
import DeleteSessionDialog from "./delete-session-dialog"

interface HistoryItemProps {
  id: string
  title: string
  location: string
  createdAt: Date
  onDelete?: () => void
}

export default function HistoryItem({ id, title, location, createdAt, onDelete }: HistoryItemProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the delete button
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/dashboard/chat/${id}`)
  }

  return (
    <Card
      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"

    >
      <div className="flex items-start justify-between">
        <div className="space-y-1" onClick={handleClick} title={`Abrir conversa "${title}"`}>
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{location}</span>
            <span>•</span>
            <span>{dayjs(createdAt).fromNow()}</span>
          </div>
        </div>
        <DeleteSessionDialog sessionId={id} onConfirm={onDelete || (() => { })} />
      </div>
    </Card>
  )
} 