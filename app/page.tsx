import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Users, Zap, MessageCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">OrçaFácil</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Orçamentos Profissionais
          <br />
          <span className="text-blue-600">em Segundos</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crie orçamentos bonitos, acompanhe respostas e converta mais clientes. Perfeito para manicures, eletricistas,
          personal trainers e tatuadores.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Criar Conta Grátis</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#demo">Ver Demonstração</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Calculator className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Crie Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Adicione serviços, preços e descrições de forma rápida e intuitiva</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Envie Rapidamente</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Compartilhe o link do orçamento via WhatsApp ou email</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Cliente Visualiza</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Página bonita e profissional para seus clientes</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Receba Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Acompanhe todas as respostas e converta mais vendas</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para Começar?</h3>
          <p className="text-xl mb-8">Crie sua primeira conta gratuita em menos de 1 minuto</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Começar Agora</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
