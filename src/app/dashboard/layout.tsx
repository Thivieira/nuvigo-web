"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Cloud, LogOut, Menu, MapPin, History } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SavedLocations from "@/components/saved-locations"
import { useAuth } from "@/contexts/auth-context"
import { useLocation } from "@/contexts/location-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { Logo } from "@/components/logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const {
    activeLocation,
    savedLocations,
    setActiveLocation,
    handleAddLocation,
    handleDeleteLocation,
    isLoading,
    error
  } = useLocation()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

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
      <div className="p-4 border-b" style={{ height: '65px' }}>
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <Logo />
        </Link>
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
              <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{user?.email || 'usuario@exemplo.com'}</p>
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
            onLocationChange={setActiveLocation}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
            isLoading={isLoading}
            error={error}
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
      {/* Sidebar for Desktop (Hidden on mobile) */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4" style={{ height: '65px' }}>
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button (Left) */}
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

            {/* Mobile Logo (Center) */}
            <Link href="/dashboard" className="flex cursor-pointer items-center gap-2 md:hidden">
              <Logo />
            </Link>

            {/* Desktop Title */}
            <h1 className="text-xl font-bold hidden md:block cursor-default">Painel de Controle</h1>

            {/* Avatar (Right side - always visible) */}
            <Link href="/dashboard/profile" className="cursor-pointer" title="Atualizar o perfil">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
} 