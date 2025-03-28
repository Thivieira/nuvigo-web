"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Send, Cloud, User, History, LogOut } from "lucide-react"
import WeatherCard from "@/components/weather-card"
import SavedLocations from "@/components/saved-locations"

export default function Dashboard() {
  const [activeLocation, setActiveLocation] = useState("New York")
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm your Nuvigo weather assistant. You can ask me about the weather in ${activeLocation} or any other location. How can I help you today?`,
      },
    ],
  })

  useEffect(() => {
    // Simulate fetching weather data
    setLoading(true)
    setTimeout(() => {
      setWeatherData({
        location: activeLocation,
        temperature: 72,
        condition: "Partly Cloudy",
        high: 78,
        low: 65,
        precipitation: "10%",
        humidity: "45%",
        wind: "8 mph",
      })
      setLoading(false)
    }, 1000)
  }, [activeLocation])

  const handleLocationChange = (location) => {
    setActiveLocation(location)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Nuvigo</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">PROFILE</h3>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">john@example.com</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> SAVED LOCATIONS
            </h3>
            <SavedLocations
              locations={["New York", "London", "Tokyo", "Sydney"]}
              activeLocation={activeLocation}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="md:hidden flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Nuvigo</span>
            </div>
            <Avatar className="md:hidden">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="chat">
            <TabsList className="mb-4">
              <TabsTrigger value="chat" className="gap-2">
                <User className="h-4 w-4" /> Chat
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
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
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                      placeholder="Ask about the weather..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">Your chat history will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

