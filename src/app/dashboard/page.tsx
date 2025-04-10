"use client"

import { useState, useEffect } from "react"
import DashboardTabs from "@/components/dashboard/dashboard-tabs"
import { useLocation } from "@/contexts/location-context"

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

export default function Dashboard() {
  const { activeLocation } = useLocation()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching weather data
    setLoading(true)
    setTimeout(() => {
      setWeatherData({
        location: activeLocation,
        temperature: 72,
        condition: "Parcialmente Nublado",
        high: 78,
        low: 65,
        precipitation: "10%",
        humidity: "45%",
        wind: "8 mph",
      })
      setLoading(false)
    }, 1000)
  }, [activeLocation])

  return (
    <DashboardTabs
      activeLocation={activeLocation}
      weatherData={weatherData}
      loading={loading}
    />
  )
}


