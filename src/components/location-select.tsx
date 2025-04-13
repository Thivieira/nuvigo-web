"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { axiosInstance } from "@/lib/axios"

interface LocationSelectProps {
  value: string
  onChange: (value: string) => void
  onCoordinatesChange?: (lat: number, lng: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

interface GoogleMapsResponse {
  name: string
  coordinates: [number, number]
}

export default function LocationSelect({
  value,
  onChange,
  onCoordinatesChange,
  placeholder = "Digite o nome da cidade",
  disabled = false,
  className = ""
}: LocationSelectProps) {
  const [suggestions, setSuggestions] = useState<GoogleMapsResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedValue = useDebounce(value, 500)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue.trim()) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const { data } = await axiosInstance.get<GoogleMapsResponse>(`/location/google-maps?name=${encodeURIComponent(debouncedValue)}`)
        setSuggestions([data])
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedValue])

  const handleSelect = (suggestion: GoogleMapsResponse) => {
    onChange(suggestion.name)
    if (onCoordinatesChange) {
      onCoordinatesChange(suggestion.coordinates[0], suggestion.coordinates[1])
    }
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Label htmlFor="location" className="sr-only">
          Localização
        </Label>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-9"
            disabled={disabled}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.name}-${index}`}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 