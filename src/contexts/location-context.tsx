"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface LocationContextType {
  activeLocation: string
  savedLocations: string[]
  setActiveLocation: (location: string) => void
  handleAddLocation: (location: string) => void
  handleDeleteLocation: (location: string) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [savedLocations, setSavedLocations] = useState<string[]>(["New York", "London", "Tokyo"])
  const [activeLocation, setActiveLocation] = useState("New York")

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

  return (
    <LocationContext.Provider
      value={{
        activeLocation,
        savedLocations,
        setActiveLocation,
        handleAddLocation,
        handleDeleteLocation,
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