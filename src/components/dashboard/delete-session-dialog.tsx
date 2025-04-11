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
import { Trash2 } from "lucide-react"
import { axiosInstance } from "@/lib/axios"

interface DeleteSessionDialogProps {
  sessionId: string
  onConfirm: () => void
  disabled?: boolean
}

export default function DeleteSessionDialog({ sessionId, onConfirm, disabled }: DeleteSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(`/api/chat/sessions/${sessionId}`)
      onConfirm()
      setOpen(false)
    } catch (error) {
      console.error('Error deleting session:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
          disabled={disabled}
          title="Excluir Conversa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Conversa</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 