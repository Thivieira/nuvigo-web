"use client"

import ChatTab from "@/components/dashboard/chat-tab"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatSkeleton } from "@/components/dashboard/chat-skeleton"
import { useChatSession } from "@/hooks/useChat"
import { use } from "react"
import { useSessionDeletion } from "@/hooks/useSessionDeletion"

interface ChatSessionPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ChatSessionPage({ params }: ChatSessionPageProps) {
  const router = useRouter()
  const { id } = use(params)

  const { data: session, isLoading } = useChatSession(id)
  const { deleteSession } = useSessionDeletion({
    onSuccess: () => {
      router.back()
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ChatSkeleton />
      </div>
    )
  }

  if (!session?.chats) {
    return null
  }


  // Get the location from the first chat message
  const location = session.chats[0]?.location || ''

  // Transform messages to match ChatTab's expected format
  const initialMessages = session.chats.map(chat => ({
    id: chat.id,
    role: chat.role as 'user' | 'assistant',
    content: chat.message
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          title="Voltar"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{session.title}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          title="Excluir conversa"
          onClick={() => deleteSession(id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <ChatTab
        activeLocation={location}
        weatherData={null}
        loading={false}
        initialMessages={initialMessages}
      />
    </div>
  )
} 