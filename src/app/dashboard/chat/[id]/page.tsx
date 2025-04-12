"use client"

import { notFound } from "next/navigation"
import ChatTab from "@/components/dashboard/chat-tab"
import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/axios"
import { ChatSkeleton } from "@/components/dashboard/chat-skeleton"
import { useChatSession } from "@/hooks/useChat"

interface ChatMessage {
  id: string
  chatSessionId: string
  message: string
  role: 'user' | 'assistant'
  turn: number
  createdAt: string
  updatedAt: string
  userId: string
  metadata: {
    low?: string
    high?: string
    humidity?: string
    location?: string
    condition?: string
    windSpeed?: string
    temperature?: string
    weatherCode?: string
    precipitation?: string
    currentTime?: string
  }
}

interface ChatSession {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  chats: ChatMessage[]
}

interface ChatSessionPageProps {
  params: Promise<{
    id: string
  }>
}

async function getChatSession(id: string): Promise<ChatSession> {
  try {
    const response = await axiosInstance.get(`/session/${id}/chats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat session:', error);
    throw error;
  }
}

export default function ChatSessionPage({ params }: ChatSessionPageProps) {
  const router = useRouter()
  const { id } = use(params)

  const { data: session, isLoading } = useChatSession(id)

  // useEffect(() => {
  //   let isMounted = true

  //   const loadSession = async () => {
  //     try {
  //       const data = await getChatSession(id)
  //       if (isMounted) {
  //         if (!data) {
  //           notFound()
  //         }
  //         setSession(data)
  //       }
  //     } catch (error) {
  //       console.error('Failed to load chat session:', error)
  //       if (isMounted) {
  //         notFound()
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setIsLoading(false)
  //       }
  //     }
  //   }

  //   loadSession()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [id])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Dashboard
          </Button>
        </div>
        <ChatSkeleton />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Get the location from the first user message's metadata
  const location = session.chats.find(chat => chat.role === 'user')?.metadata.location || ''

  // Transform messages to match ChatTab's expected format
  const transformedMessages = session.chats.map(chat => ({
    id: chat.id,
    role: chat.role,
    content: chat.message
  }))

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Dashboard
        </Button>
      </div>

      <ChatTab
        activeLocation={location}
        weatherData={null}
        loading={false}
        initialMessages={transformedMessages.length > 0 ? transformedMessages : undefined}
      />
    </div>
  )
} 