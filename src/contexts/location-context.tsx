"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "./auth-context"
import { Location, createLocation, deleteLocation, setActiveLocation } from "@/services/locationService"
import { useSwrApiWithError } from "@/hooks/useSwrApi"

interface LocationContextType {
  activeLocation: string
  savedLocations: string[]
  setActiveLocation: (location: string) => Promise<void>
  handleAddLocation: (location: string) => Promise<void>
  handleDeleteLocation: (location: string) => Promise<void>
  isLoading: boolean
  error: Error | null
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const { tokens } = useAuth()

  const {
    data: locationsData,
    error,
    isLoading,
    mutate: mutateLocations
  } = useSwrApiWithError<{ locations: Location[] }>(
    tokens?.accessToken ? '/location' : null,
    tokens?.accessToken,
    {
      refreshInterval: 300000, // 5 minutes
    }
  )

  const locations = locationsData?.locations || []

  const handleAddLocation = async (locationName: string) => {
    try {
      await createLocation(tokens!.accessToken, { name: locationName })
      await mutateLocations()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add location')
    }
  }

  const handleDeleteLocation = async (locationName: string) => {
    try {
      const locationToDelete = locations.find(loc => loc.name === locationName)
      if (!locationToDelete) return

      await deleteLocation(tokens!.accessToken, locationToDelete.id)
      await mutateLocations()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete location')
    }
  }

  const handleSetActiveLocation = async (locationName: string) => {
    try {
      const locationToActivate = locations.find(loc => loc.name === locationName)
      if (!locationToActivate) return

      await setActiveLocation(tokens!.accessToken, locationToActivate.id)
      await mutateLocations()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to set active location')
    }
  }

  const activeLocation = locations.find(loc => loc.isActive)?.name || locations[0]?.name || ""
  const savedLocations = locations.map(loc => loc.name)

  return (
    <LocationContext.Provider
      value={{
        activeLocation,
        savedLocations,
        setActiveLocation: handleSetActiveLocation,
        handleAddLocation,
        handleDeleteLocation,
        isLoading,
        error
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
} 