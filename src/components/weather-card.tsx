import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, CloudRain, Thermometer, Wind, Droplets } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  high: number
  low: number
  precipitation: string
  humidity: string
  wind: string
}

interface WeatherCardProps {
  data: WeatherData | null
  loading: boolean
}

export default function WeatherCard({ data, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center justify-center bg-primary/10 h-24 w-24 rounded-full">
            <Cloud className="h-12 w-12 text-primary" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{data.location}</h2>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{data.temperature}°F</span>
              <span className="text-muted-foreground">{data.condition}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">High/Low</p>
                  <p className="font-medium">
                    {data.high}°F / {data.low}°F
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Precipitation</p>
                  <p className="font-medium">{data.precipitation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">{data.humidity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="font-medium">{data.wind}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

