import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are Nuvigo, an AI weather assistant. You provide helpful, friendly, and conversational responses about weather conditions. When users ask about weather in a specific location, use the getWeather tool to fetch accurate data.",
    tools: {
      getWeather: {
        description: "Get the current weather for a location",
        parameters: z.object({
          location: z.string().describe("The city or location to get weather for"),
        }),
        execute: async ({ location }: { location: string }) => {
          // In a real app, this would call the Tomorrow.io API
          // For now, we'll return mock data
          const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorms", "Snowy"]
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
          const temperature = Math.floor(Math.random() * (90 - 32) + 32)
          const humidity = Math.floor(Math.random() * (90 - 30) + 30)
          const windSpeed = Math.floor(Math.random() * 20)

          return {
            location,
            temperature: `${temperature}°F`,
            condition: randomCondition,
            humidity: `${humidity}%`,
            windSpeed: `${windSpeed} mph`,
            timestamp: new Date().toISOString(),
          }
        },
      },
      getForecast: {
        description: "Get the weather forecast for a location",
        parameters: z.object({
          location: z.string().describe("The city or location to get forecast for"),
          days: z.number().optional().describe("Number of days for the forecast (default: 5)"),
        }),
        execute: async ({ location, days = 5 }: { location: string; days?: number }) => {
          // Mock forecast data
          const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorms", "Snowy"]
          const forecast = []

          for (let i = 0; i < days; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)

            forecast.push({
              date: date.toISOString().split("T")[0],
              condition: conditions[Math.floor(Math.random() * conditions.length)],
              highTemp: Math.floor(Math.random() * (90 - 60) + 60),
              lowTemp: Math.floor(Math.random() * (60 - 30) + 30),
              precipitation: `${Math.floor(Math.random() * 100)}%`,
            })
          }

          return {
            location,
            forecast,
            timestamp: new Date().toISOString(),
          }
        },
      },
    },
  })

  return result.toDataStreamResponse()
}

