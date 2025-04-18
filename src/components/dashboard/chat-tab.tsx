"use client";

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, User, Bot } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { useToast } from "@/hooks/use-toast"
import WeatherCard from "@/components/weather-card"
import { WeatherData } from "@/types/weather"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatTabProps {
  activeLocation: string;
  weatherData: WeatherData | null;
  loading: boolean;
  initialMessages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }>;
}

export default function ChatTab({ activeLocation, weatherData, loading, initialMessages }: ChatTabProps) {
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages
  } = useChat({
    initialMessages: initialMessages || [
      {
        id: Date.now().toString(),
        role: "assistant",
        content: activeLocation
          ? `Olá! Sou seu assistente meteorológico Nuvigo. Você pode me perguntar sobre o clima em ${activeLocation} ou em qualquer outro local. Como posso ajudar você hoje?`
          : "Olá! Sou seu assistente meteorológico Nuvigo. Você pode me perguntar sobre o clima em qualquer local. Como posso ajudar você hoje?",
      },
    ],
    activeLocation
  })

  useEffect(() => {
    if (status === 'error') {
      toast({
        description: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        type: "error"
      })
    }
  }, [status, toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!initialMessages || initialMessages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: activeLocation
            ? `Olá! Sou seu assistente meteorológico Nuvigo. Você pode me perguntar sobre o clima em ${activeLocation} ou em qualquer outro local. Como posso ajudar você hoje?`
            : "Olá! Sou seu assistente meteorológico Nuvigo. Você pode me perguntar sobre o clima em qualquer local. Como posso ajudar você hoje?",
        },
      ])
    }
  }, [activeLocation, setMessages, initialMessages])

  return (
    <div className="space-y-4">
      {weatherData && <WeatherCard data={weatherData} loading={loading} />}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem..."
                disabled={status === 'submitted' || status === 'streaming'}
              />
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={(status === 'submitted' || status === 'streaming') || !input.trim()}
              >
                {status === 'submitted' || status === 'streaming' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 