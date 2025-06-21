"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Loader2, AlertCircle } from "lucide-react"
import { loginUser, useAuth } from "@/lib/services/auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, initialized } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    console.log("🔄 Verificando estado do usuário:", { user: !!user, authLoading, initialized })

    if (initialized && user && !authLoading) {
      console.log("✅ Usuário logado, redirecionando para dashboard...")
      router.push("/dashboard")
    }
  }, [user, authLoading, initialized, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email e senha são obrigatórios")
      return
    }

    setLoading(true)

    try {
      console.log("🔄 Tentando fazer login...")
      const result = await loginUser(formData.email, formData.password)

      if (result.success) {
        console.log("✅ Login bem-sucedido, aguardando redirecionamento...")
        // O redirecionamento será feito pelo useEffect quando o user mudar
      } else {
        console.error("❌ Erro no login:", result.error)
        // Traduzir erros comuns do Firebase
        let errorMessage = result.error || "Erro ao fazer login"

        if (errorMessage.includes("user-not-found")) {
          errorMessage = "Usuário não encontrado"
        } else if (errorMessage.includes("wrong-password")) {
          errorMessage = "Senha incorreta"
        } else if (errorMessage.includes("invalid-email")) {
          errorMessage = "Email inválido"
        } else if (errorMessage.includes("too-many-requests")) {
          errorMessage = "Muitas tentativas. Tente novamente mais tarde"
        } else if (errorMessage.includes("invalid-credential")) {
          errorMessage = "Email ou senha incorretos"
        }

        setError(errorMessage)
      }
    } catch (err) {
      console.error("❌ Erro inesperado no login:", err)
      setError("Erro inesperado ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Limpar erro quando usuário começar a digitar
    if (error) setError(null)
  }

  // Se já estiver logado, mostrar loading
  if (user && initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecionando para o dashboard...</p>
        </div>
      </div>
    )
  }

  // Se ainda estiver carregando o auth
  if (authLoading && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Calculator className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Entrar no OrçaFácil</CardTitle>
          <CardDescription>Entre na sua conta para gerenciar seus orçamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Sua senha"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Debug Info - Remover em produção */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Debug Info:</p>
              <p>Loading: {loading ? "Yes" : "No"}</p>
              <p>Auth Loading: {authLoading ? "Yes" : "No"}</p>
              <p>Initialized: {initialized ? "Yes" : "No"}</p>
              <p>User: {user ? `${user.email}` : "None"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
