"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Eye,
  Plus,
  Trash2,
  MessageCircle,
  Mail,
  Check,
  Send,
  ArrowRight,
  Copy,
  Share2,
  Info,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"

interface DemoService {
  id: string
  name: string
  description: string
  price: number
}

// Função para formatar moeda brasileira
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Função para formatar input de moeda
const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "")

  // Converte para centavos
  const amount = Number.parseInt(numbers) / 100

  // Formata como moeda
  return formatCurrency(amount)
}

// Função para extrair valor numérico do input formatado
const parseCurrencyInput = (value: string): number => {
  const numbers = value.replace(/\D/g, "")
  return Number.parseInt(numbers) / 100 || 0
}

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("professional")
  const [demoServices, setDemoServices] = useState<DemoService[]>([
    {
      id: "1",
      name: "Manicure Completa",
      description: "Inclui: Cutícula, esmaltação, hidratação e massagem",
      price: 25.0,
    },
  ])
  const [showQuotePreview, setShowQuotePreview] = useState(false)
  const [isCreatingQuote, setIsCreatingQuote] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copiedLink, setCopiedLink] = useState(false)

  const addDemoService = () => {
    setDemoServices([
      ...demoServices,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        price: 0,
      },
    ])
  }

  const removeDemoService = (id: string) => {
    setDemoServices(demoServices.filter((service) => service.id !== id))
  }

  const updateDemoService = (id: string, field: keyof DemoService, value: string | number) => {
    setDemoServices(demoServices.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const handlePriceChange = (id: string, formattedValue: string) => {
    const numericValue = parseCurrencyInput(formattedValue)
    updateDemoService(id, "price", numericValue)
  }

  const total = demoServices.reduce((sum, service) => sum + service.price, 0)

  const mockProfessional = {
    name: "Maria Silva",
    profession: "Manicure Profissional",
    whatsapp: "+5511999999999",
  }

  // Simular criação de orçamento com loading
  const handleCreateQuote = async () => {
    setIsCreatingQuote(true)
    setProgress(0)

    // Simular progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCreatingQuote(false)
          setShowQuotePreview(true)
          return 100
        }
        return prev + 20
      })
    }, 300)
  }

  // Copiar link para clipboard
  const copyLink = async () => {
    await navigator.clipboard.writeText("https://orcafacil.com/quote/demo-123")
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Calcular completude do orçamento
  const completedServices = demoServices.filter((s) => s.name && s.price > 0).length
  const completionPercentage = (completedServices / demoServices.length) * 100

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Visão do Profissional
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visão do Cliente
            </TabsTrigger>
          </TabsList>

          {/* Visão do Profissional */}
          <TabsContent value="professional" className="space-y-6">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Dashboard do Profissional
              </h4>
              <p className="text-gray-600">Veja como é fácil criar um orçamento profissional</p>
            </div>

            {!showQuotePreview ? (
              <>
                {/* Mini Dashboard com animações */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Orçamentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-green-600">+3 este mês</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Este Mês
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-blue-600">67% do objetivo</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Taxa Resposta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">75%</div>
                      <p className="text-xs text-green-600">Acima da média</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ 2.450</div>
                      <p className="text-xs text-green-600">+15% vs mês anterior</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Criar Orçamento Demo */}
                <Card className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Criar Novo Orçamento
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Esta é uma demonstração interativa. Você pode testar todas as funcionalidades!</p>
                            </TooltipContent>
                          </Tooltip>
                        </CardTitle>
                        <CardDescription>Demonstração - Experimente criar um orçamento</CardDescription>
                      </div>
                      <Badge variant="secondary" className="animate-pulse">
                        DEMO
                      </Badge>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Completude do orçamento</span>
                        <span>{Math.round(completionPercentage)}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {demoServices.map((service, index) => (
                      <div
                        key={service.id}
                        className="p-4 border rounded-lg space-y-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold flex items-center gap-2">
                            Serviço {index + 1}
                            {service.name && service.price > 0 && <Check className="h-4 w-4 text-green-600" />}
                          </h3>
                          {demoServices.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDemoService(service.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-4">
                          <div>
                            <Label>Nome do Serviço</Label>
                            <Input
                              value={service.name}
                              onChange={(e) => updateDemoService(service.id, "name", e.target.value)}
                              placeholder="Ex: Manicure + Pedicure"
                              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <Label>Descrição</Label>
                            <Textarea
                              value={service.description}
                              onChange={(e) => updateDemoService(service.id, "description", e.target.value)}
                              placeholder="Descreva o que está incluso no serviço..."
                              rows={3}
                              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <Label>Preço</Label>
                            <Input
                              value={service.price > 0 ? formatCurrency(service.price) : ""}
                              onChange={(e) => handlePriceChange(service.id, e.target.value)}
                              placeholder="R$ 0,00"
                              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDemoService}
                      className="w-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Serviço
                    </Button>

                    {/* Total com destaque */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total:</span>
                          <span className="text-2xl text-blue-600">{formatCurrency(total)}</span>
                        </div>
                        {total > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            Valor médio por serviço:{" "}
                            {formatCurrency(total / demoServices.filter((s) => s.price > 0).length || 1)}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleCreateQuote}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={!demoServices.some((s) => s.name && s.price > 0) || isCreatingQuote}
                      >
                        {isCreatingQuote ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Criando...
                          </>
                        ) : (
                          <>
                            Visualizar Orçamento
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" disabled>
                            Salvar (Bloqueado na Demo)
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Crie uma conta para salvar seus orçamentos!</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Loading progress */}
                    {isCreatingQuote && (
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-gray-600 text-center">
                          {progress < 40 && "Processando serviços..."}
                          {progress >= 40 && progress < 80 && "Gerando layout..."}
                          {progress >= 80 && "Finalizando orçamento..."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Preview do Orçamento Criado */
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Orçamento Criado com Sucesso!
                      </CardTitle>
                      <CardDescription>Assim ficaria seu orçamento para o cliente</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setShowQuotePreview(false)}>
                      Voltar para Edição
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">Link do Orçamento Gerado:</h3>
                      <div className="bg-white p-3 rounded border font-mono text-sm flex items-center justify-between">
                        <span>https://orcafacil.com/quote/demo-123</span>
                        <Button variant="ghost" size="sm" onClick={copyLink} className="ml-2">
                          {copiedLink ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      {copiedLink && (
                        <p className="text-sm text-green-600 mt-2">Link copiado para a área de transferência!</p>
                      )}
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                      <Button onClick={() => setActiveTab("client")} className="bg-blue-600 hover:bg-blue-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver como Cliente
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" disabled>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar por WhatsApp (Demo)
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Disponível na versão completa!</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" disabled>
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar (Demo)
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Disponível na versão completa!</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Visão do Cliente */}
          <TabsContent value="client" className="space-y-6">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Eye className="h-6 w-6 text-purple-600" />
                Como o Cliente Vê
              </h4>
              <p className="text-gray-600">Página profissional que seus clientes recebem</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Simulação da página do cliente */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg shadow-xl">
                {/* Header do Cliente */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamento Profissional</h1>
                  <p className="text-gray-600">Preparado especialmente para você por {mockProfessional.name}</p>
                </div>

                {/* Info do Profissional */}
                <Card className="mb-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{mockProfessional.name}</CardTitle>
                        <CardDescription>{mockProfessional.profession}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Profissional Verificado
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Serviços */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Serviços Inclusos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoServices
                      .filter((s) => s.name && s.price > 0)
                      .map((service, index) => (
                        <div
                          key={service.id}
                          className="flex justify-between items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-lg">{formatCurrency(service.price)}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Total */}
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Orçamento válido até {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="space-y-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 shadow-lg" disabled>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Aceitar via WhatsApp (Demo)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Na versão real, este botão abre o WhatsApp automaticamente!</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="w-full" disabled>
                        <Mail className="h-5 w-5 mr-2" />
                        Solicitar Mais Informações (Demo)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Na versão real, este botão envia um email automaticamente!</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Features */}
                <div className="mt-8 p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-4 text-sm text-gray-600 justify-center flex-wrap">
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Profissional verificado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Orçamento detalhado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Contato direto</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão para voltar */}
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => setActiveTab("professional")}>
                  Voltar para Visão do Profissional
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
