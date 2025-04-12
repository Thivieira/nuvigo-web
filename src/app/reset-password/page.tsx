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
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

// Define the validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

// Type for the form data
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Get token from URL
  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setMessage({
        type: 'error',
        text: 'Token de redefinição de senha inválido ou ausente'
      })
    }
  }, [searchParams])

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  // Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setMessage({
        type: 'error',
        text: 'Token de redefinição de senha inválido ou ausente'
      })
      return
    }

    try {
      setIsSubmitting(true)
      setMessage(null)

      const result = await resetPassword({
        token,
        password: data.password
      })

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push('/login?reset=true')
        }, 3000)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (err) {
      console.error('Password reset failed:', err)
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro ao redefinir a senha'
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
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha
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
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse">Carregando...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
} 