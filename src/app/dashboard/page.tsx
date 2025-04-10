"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Cloud,
  LogOut,
  Menu,
  History,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import SavedLocations from "@/components/saved-locations"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardTabs from "@/components/dashboard/dashboard-tabs"

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
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeLocation, setActiveLocation] = useState("New York")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedLocations, setSavedLocations] = useState<string[]>(["New York", "London", "Tokyo"])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

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

  const handleLocationChange = (location: string) => {
    setActiveLocation(location)
  }

  const handleAddLocation = (location: string) => {
    if (!savedLocations.includes(location)) {
      setSavedLocations([...savedLocations, location])
    }
  }

  const handleDeleteLocation = (location: string) => {
    // Don't allow deleting the last location
    if (savedLocations.length <= 1) {
      return
    }

    // Remove the location from the list
    const updatedLocations = savedLocations.filter(loc => loc !== location)
    setSavedLocations(updatedLocations)

    // If the deleted location was active, set a new active location
    if (activeLocation === location) {
      setActiveLocation(updatedLocations[0])
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 cursor-default">
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Nuvigo</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            PERFIL
          </h3>
          <div
            className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer"
            onClick={() => router.push('/dashboard/profile')}
            title="Atualizar o Perfil"
          >
            <Avatar>
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'usuario@exemplo.com'}</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            LOCALIZAÇÕES SALVAS
          </h3>
          <SavedLocations
            locations={savedLocations}
            activeLocation={activeLocation}
            onLocationChange={handleLocationChange}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <History className="h-4 w-4" />
            CONVERSAS RECENTES
          </h3>
          <div className="space-y-2">
            <div className="p-2 rounded-md hover:bg-slate-100 cursor-pointer">
              <p className="text-sm font-medium">Clima em São Paulo</p>
              <p className="text-xs text-muted-foreground">Hoje, 10:30</p>
            </div>
            <div className="p-2 rounded-md hover:bg-slate-100 cursor-pointer">
              <p className="text-sm font-medium">Previsão Rio de Janeiro</p>
              <p className="text-xs text-muted-foreground">Ontem, 15:45</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar para Desktop (Oculto em dispositivos móveis) */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <SidebarContent />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            {/* Botão do Menu Mobile (Esquerda) */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="cursor-pointer">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 flex flex-col">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo Mobile (Centro) */}
            <div className="flex items-center gap-2 md:hidden">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Nuvigo</span>
            </div>

            {/* Título Desktop (Substitui o logo em telas maiores) */}
            <h1 className="text-xl font-bold hidden md:block">Painel de Controle</h1>

            {/* Avatar (Lado direito - sempre visível) */}
            <Link href="/dashboard/profile" className="cursor-pointer" title="Atualizar o perfil">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <DashboardTabs
            activeLocation={activeLocation}
            weatherData={weatherData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}


