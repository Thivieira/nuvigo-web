"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddLocationDialog from "./add-location-dialog"
import DeleteLocationDialog from "./delete-location-dialog"

interface SavedLocationsProps {
  locations: string[]
  activeLocation: string
  onLocationChange: (location: string) => void
  onAddLocation?: (location: string) => void
  onDeleteLocation?: (location: string) => void
}

export default function SavedLocations({
  locations,
  activeLocation,
  onLocationChange,
  onAddLocation = () => { },
  onDeleteLocation = () => { }
}: SavedLocationsProps) {
  return (
    <div className="space-y-1 w-full">
      {locations.map((location) => (
        <div key={location} className="flex items-center gap-1">
          <Button
            variant={activeLocation === location ? "secondary" : "ghost"}
            className="flex-1 justify-start gap-2 cursor-pointer"
            onClick={() => onLocationChange(location)}
          >
            <MapPin className="h-4 w-4" />
            {location}
          </Button>
          <DeleteLocationDialog
            location={location}
            onConfirm={() => onDeleteLocation(location)}
            disabled={locations.length <= 1}
          />
        </div>
      ))}

      <AddLocationDialog onAddLocation={onAddLocation} />
    </div>
  )
}

