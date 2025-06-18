"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"
import { useRouter } from "next/navigation"

// database
import { auth } from "@/firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setShowError(true)
      return
    }
    setShowError(false)

    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso")
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setShowError(true);
    } finally {
      setLoading(false)
    }
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {showError && (
              <p className="text-red-500 text-sm">
                Email ou senha inválidos. Tente novamente.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
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
        </CardContent>
      </Card>
    </div>
  )
}
