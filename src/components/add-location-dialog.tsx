"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import LocationSelect from "./location-select"

interface AddLocationDialogProps {
  onAddLocation: (location: string) => Promise<void>
}

export default function AddLocationDialog({ onAddLocation }: AddLocationDialogProps) {
  const [location, setLocation] = useState("")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return

    try {
      setIsLoading(true)
      setError(null)
      await onAddLocation(location.trim())
      setLocation("")
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add location'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground cursor-pointer">
          <Plus className="h-4 w-4" />
          Adicionar Localização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Localização</DialogTitle>
          <DialogDescription>
            Digite o nome de uma cidade para adicioná-la às suas localizações salvas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <LocationSelect
                value={location}
                onChange={setLocation}
                placeholder="Digite o nome da cidade"
                disabled={isLoading}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="cursor-pointer" disabled={!location.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                'Adicionar Localização'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 