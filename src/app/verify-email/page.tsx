"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Get token from URL
  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      verifyEmailToken(tokenParam)
    } else {
      setMessage({
        type: 'error',
        text: 'Token de verificação inválido ou ausente'
      })
      setIsVerifying(false)
    }
  }, [searchParams])

  const verifyEmailToken = async (token: string) => {
    try {
      const result = await verifyEmail({ token })

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Email verificado com sucesso! Você já pode fazer login.'
        })
        // Redirect to login after successful verification
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 3000)
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Falha na verificação do email'
        })
      }
    } catch (err) {
      console.error('Email verification failed:', err)
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro ao verificar o email'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Cloud className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verificação de Email</CardTitle>
          <CardDescription>
            {isVerifying
              ? 'Verificando seu email...'
              : 'Processo de verificação concluído'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-destructive/10 text-destructive'
              }`}>
              {message.text}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            className="w-full cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Ir para o Login
          </Button>
          <div className="text-center text-sm">
            <Link href="/" className="text-primary hover:underline">
              Voltar para a Página Inicial
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse">Carregando...</div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
} 