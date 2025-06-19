import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Users, Zap, MessageCircle, Check, X } from "lucide-react"
import { DemoSection } from "@/components/demo-section"
import { Badge } from "@/components/ui/badge"

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
      <section id="demo" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Veja na Prática</h3>
        <DemoSection />
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Escolha o Plano Ideal</h3>
          <p className="text-xl text-gray-600">Comece grátis e evolua conforme sua necessidade</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plano Gratuito */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Gratuito</CardTitle>
              <CardDescription>Perfeito para começar</CardDescription>
              <div className="text-3xl font-bold">
                R$ 0<span className="text-lg font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Até 5 orçamentos por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>3 serviços por orçamento</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Link básico de compartilhamento</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Histórico de 30 dias</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <X className="h-4 w-4" />
                  <span>Sem logo personalizada</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <X className="h-4 w-4" />
                  <span>Sem relatórios avançados</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/register">Começar Grátis</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Plano Profissional */}
          <Card className="relative border-blue-500 border-2">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600">Mais Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Profissional</CardTitle>
              <CardDescription>Para profissionais ativos</CardDescription>
              <div className="text-3xl font-bold">
                R$ 29<span className="text-lg font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Até 50 orçamentos por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Serviços ilimitados por orçamento</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Link personalizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Histórico completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Logo personalizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Relatórios básicos</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <X className="h-4 w-4" />
                  <span>Sem integração com pagamentos</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register">Escolher Profissional</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>Máximo desempenho</CardDescription>
              <div className="text-3xl font-bold">
                R$ 59<span className="text-lg font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Orçamentos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Tudo do plano Profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Integração com pagamentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>API para integrações</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Templates personalizados</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/register">Escolher Premium</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
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
