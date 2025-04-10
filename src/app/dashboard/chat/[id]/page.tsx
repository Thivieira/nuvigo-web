"use client"

import { notFound } from "next/navigation"
import ChatTab from "@/components/dashboard/chat-tab"
import { mockChatSessions } from "@/mocks/chat-history"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatSessionPageProps {
  params: {
    id: string
  }
}

async function getChatSession(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch session")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching chat session:", error)
    // Fallback to mock data if API call fails
    return mockChatSessions.find((s) => s.id === id) || null
  }
}

export default function ChatSessionPage({ params }: ChatSessionPageProps) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const loadSession = async () => {
      const data = await getChatSession(params.id)
      if (!data) {
        notFound()
      }
      setSession(data)
    }
    loadSession()
  }, [params.id])

  if (!session) {
    return null // or a loading state
  }

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
        activeLocation={session.location}
        weatherData={null}
        loading={false}
        initialMessages={session.messages}
      />
    </div>
  )
} 