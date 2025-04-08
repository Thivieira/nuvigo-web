"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

interface SavedLocationsProps {
  locations: string[]
  activeLocation: string
  onLocationChange: (location: string) => void
}

export default function SavedLocations({ locations, activeLocation, onLocationChange }: SavedLocationsProps) {
  return (
    <div className="space-y-1">
      {locations.map((location) => (
        <Button
          key={location}
          variant={activeLocation === location ? "secondary" : "ghost"}
          className="w-full justify-start gap-2 cursor-pointer"
          onClick={() => onLocationChange(location)}
        >
          <MapPin className="h-4 w-4" />
          {location}
        </Button>
      ))}

      <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground cursor-pointer">
        <Plus className="h-4 w-4" />
        Add Location
      </Button>
    </div>
  )
}

