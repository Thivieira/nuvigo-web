"use client"

import { MapPin, Loader2 } from "lucide-react"
import AddLocationDialog from "./add-location-dialog"
import DeleteLocationDialog from "./delete-location-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SavedLocationsProps {
  locations: string[]
  activeLocation: string
  onLocationChange: (location: string) => void
  onAddLocation?: (location: string) => Promise<void>
  onDeleteLocation?: (location: string) => Promise<void>
  isLoading?: boolean
  error?: Error | null
}

export default function SavedLocations({
  locations,
  activeLocation,
  onLocationChange,
  onAddLocation = async () => { },
  onDeleteLocation = async () => { },
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
        <div
          key={location}
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${activeLocation === location
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-slate-100'
            }`}
        >
          <div
            className="flex items-center gap-2 flex-1"
            onClick={() => onLocationChange(location)}
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
          <DeleteLocationDialog
            location={location}
            onConfirm={async () => await onDeleteLocation(location)}
          />
        </div>
      ))}
      <AddLocationDialog onAddLocation={onAddLocation} />
    </div>
  )
}

