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
import { registerUser, useAuth } from "@/lib/services/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return false
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório")
      return false
    }

    if (!formData.profession.trim()) {
      setError("Profissão é obrigatória")
      return false
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem")
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("Iniciando registro...")

      const result = await registerUser(formData.email, formData.password, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        profession: formData.profession.trim(),
      })

      console.log("Resultado do registro:", result)

      if (result.success) {
        console.log("Registro bem-sucedido, redirecionando...")
        // Dar um tempo para o Firebase processar
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        console.error("Erro no registro:", result.error)
        // Traduzir erros comuns do Firebase
        let errorMessage = result.error || "Erro ao criar conta"

        if (errorMessage.includes("email-already-in-use")) {
          errorMessage = "Este email já está em uso"
        } else if (errorMessage.includes("weak-password")) {
          errorMessage = "Senha muito fraca"
        } else if (errorMessage.includes("invalid-email")) {
          errorMessage = "Email inválido"
        }

        setError(errorMessage)
      }
    } catch (err) {
      console.error("Erro inesperado no registro:", err)
      setError("Erro inesperado ao criar conta. Tente novamente.")
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
  if (user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecionando para o dashboard...</p>
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
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Comece a criar orçamentos profissionais gratuitamente</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Maria Silva"
                required
                disabled={loading}
              />
            </div>

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
              <Label htmlFor="profession">Profissão</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                placeholder="Ex: Manicure, Eletricista, Personal Trainer..."
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Informe sua área de atuação para personalizar sua experiência</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Digite a senha novamente"
                required
                disabled={loading}
                minLength={6}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600">As senhas não coincidem</p>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.password.length >= 6 && <p className="text-xs text-green-600">✓ Senhas coincidem</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Grátis"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>

          {/* Debug Info - Remover em produção */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Debug: {loading ? "Loading..." : "Ready"}</p>
              <p>Auth Loading: {authLoading ? "Yes" : "No"}</p>
              <p>User: {user ? "Logged in" : "Not logged in"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
