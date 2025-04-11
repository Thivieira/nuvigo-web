"use client"

import { useState, useEffect } from "react"
import DashboardTabs from "@/components/dashboard/dashboard-tabs"
import { useLocation } from "@/contexts/location-context"
import { useWeather } from "@/hooks/useWeather"
import { useToast } from "@/hooks/use-toast"
import { WeatherData } from "@/types/weather"

export default function Dashboard() {
  const { activeLocation } = useLocation()
  const { toast } = useToast()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  const { data, error, isLoading } = useWeather({ location: activeLocation })

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar dados do clima",
        description: error,
        type: "error"
      })
    }
  }, [error, toast])

  useEffect(() => {
    if (data) {
      setWeatherData({
        location: data.location,
        temperature: data.temperature,
        condition: data.condition,
        high: data.high,
        low: data.low,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        precipitation: data.precipitation,
        weatherCode: data.weatherCode,
      })
    }
  }, [data])

  return (
    <DashboardTabs
      activeLocation={activeLocation}
      weatherData={weatherData}
      loading={isLoading}
    />
  )
}


