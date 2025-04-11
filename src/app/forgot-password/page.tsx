"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Cloud } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um endereço de email válido" })
})

// Type for the form data
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const router = useRouter()
  const { forgotPassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true)
      setMessage(null)
      console.log('Submitting forgot password form with email:', data.email)

      const result = await forgotPassword({ email: data.email })

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Instruções para redefinição de senha foram enviadas para seu email'
        })

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login?emailSent=true')
        }, 3000)
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Ocorreu um erro ao solicitar a redefinição de senha'
        })
      }
    } catch (err) {
      console.error('Forgot password request failed:', err)
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro ao solicitar a redefinição de senha'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Cloud className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Digite seu email e enviaremos instruções para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {message && (
              <div className={`p-3 rounded-md text-sm ${message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-destructive/10 text-destructive'
                }`}>
                {message.text}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar instruções"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 