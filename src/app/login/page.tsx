"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Cloud, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um endereço de email válido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" })
})

// Type for the form data
type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check for verification success message
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccess('Email verificado com sucesso! Você já pode fazer login.')
    } else if (searchParams.get('registered') === 'true') {
      setSuccess('Conta criada com sucesso! Por favor, verifique seu email para ativar sua conta.')
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      const redirectTo = searchParams.get('from') || '/dashboard'
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, searchParams])

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      setSuccess(null)
      setIsLoggingIn(true)
      console.log('Submitting login form with email:', data.email);

      const response = await login(data)
      console.log('Login successful, response:', response);

      // The redirection will be handled by the useEffect above
    } catch (err: any) {
      console.error('Login failed:', err)
      // Check if it's a server error (network error or 5xx status)
      if (err.response?.status >= 500) {
        setError('Servidor indisponível no momento. Por favor, tente novamente mais tarde.')
      } else {
        // For other errors (like 401, 403), show invalid credentials message
        setError('Credenciais inválidas. Por favor, tente novamente.')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Cloud className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>Digite seu email e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                {success}
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
                <p id="email-error" className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar senha" : "Mostrar senha"}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isLoggingIn}>
              {isSubmitting || isLoggingIn ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
            <Link href="/" passHref className="w-full">
              <Button variant="outline" className="w-full cursor-pointer">Voltar para a Página Inicial</Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

