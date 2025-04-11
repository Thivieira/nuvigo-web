"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useAuth } from "./auth-context"
import { Location, createLocation, deleteLocation, getLocations, setActiveLocation } from "@/services/locationService"

interface LocationContextType {
  activeLocation: string
  savedLocations: string[]
  setActiveLocation: (location: string) => void
  handleAddLocation: (location: string) => void
  handleDeleteLocation: (location: string) => void
  isLoading: boolean
  error: Error | null
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const { tokens } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch locations on mount and when access token changes
  useEffect(() => {
    if (tokens?.accessToken) {
      fetchLocations()
    }
  }, [tokens?.accessToken])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getLocations(tokens!.accessToken)
      setLocations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch locations'))
      setLocations([]) // Ensure locations is always an array
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLocation = async (locationName: string) => {
    try {
      setError(null)
      const newLocation = await createLocation(tokens!.accessToken, { name: locationName })
      setLocations(prev => [...prev, newLocation])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add location'))
      throw err
    }
  }

  const handleDeleteLocation = async (locationName: string) => {
    try {
      setError(null)
      const locationToDelete = locations.find(loc => loc.name === locationName)
      if (!locationToDelete) return

      await deleteLocation(tokens!.accessToken, locationToDelete.id)
      setLocations(prev => prev.filter(loc => loc.id !== locationToDelete.id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete location'))
      throw err
    }
  }

  const handleSetActiveLocation = async (locationName: string) => {
    try {
      setError(null)
      const locationToActivate = locations.find(loc => loc.name === locationName)
      if (!locationToActivate) return

      const updatedLocation = await setActiveLocation(tokens!.accessToken, locationToActivate.id)
      setLocations(prev =>
        prev.map(loc =>
          loc.id === updatedLocation.id
            ? updatedLocation
            : { ...loc, isActive: false }
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set active location'))
      throw err
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