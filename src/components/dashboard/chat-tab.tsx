import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import WeatherCard from "@/components/weather-card"

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  humidity: string;
  wind: string;
}

interface ChatTabProps {
  activeLocation: string;
  weatherData: WeatherData | null;
  loading: boolean;
}

export default function ChatTab({ activeLocation, weatherData, loading }: ChatTabProps) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Olá! Sou seu assistente meteorológico Nuvigo. Você pode me perguntar sobre o clima em ${activeLocation} ou em qualquer outro local. Como posso ajudar você hoje?`,
      },
    ],
  })

  return (
    <div className="space-y-4">
      {weatherData && <WeatherCard data={weatherData} loading={loading} />}

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pergunte sobre o clima..."
              className="flex-1"
              disabled={status === 'submitted' || status === 'streaming'}
            />
            <Button
              type="submit"
              size="icon"
              className="cursor-pointer"
              disabled={(status === 'submitted' || status === 'streaming') || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 