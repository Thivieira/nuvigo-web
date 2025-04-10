"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Plus, MapPin } from "lucide-react"

interface AddLocationDialogProps {
  onAddLocation: (location: string) => void
}

export default function AddLocationDialog({ onAddLocation }: AddLocationDialogProps) {
  const [location, setLocation] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      onAddLocation(location.trim())
      setLocation("")
      setOpen(false)
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Localização
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Digite o nome da cidade"
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!location.trim()}>Adicionar Localização</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 