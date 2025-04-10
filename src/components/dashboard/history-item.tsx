import { Card } from "@/components/ui/card"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import relativeTime from "dayjs/plugin/relativeTime"
import { useRouter } from "next/navigation"

dayjs.extend(relativeTime)
dayjs.locale("pt-br")

interface HistoryItemProps {
  id: string
  title: string
  location: string
  createdAt: Date
}

export default function HistoryItem({ id, title, location, createdAt }: HistoryItemProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/dashboard/chat/${id}`)
  }

  return (
    <Card
      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{location}</span>
          <span>•</span>
          <span>{dayjs(createdAt).fromNow()}</span>
        </div>
      </div>
    </Card>
  )
} 