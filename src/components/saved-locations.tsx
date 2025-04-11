"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddLocationDialog from "./add-location-dialog"
import DeleteLocationDialog from "./delete-location-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SavedLocationsProps {
  locations: string[]
  activeLocation: string
  onLocationChange: (location: string) => void
  onAddLocation?: (location: string) => void
  onDeleteLocation?: (location: string) => void
  isLoading?: boolean
  error?: Error | null
}

export default function SavedLocations({
  locations,
  activeLocation,
  onLocationChange,
  onAddLocation = () => { },
  onDeleteLocation = () => { },
  isLoading = false,
  error = null
}: SavedLocationsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    )
  }

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

