"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Send,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  MoreHorizontal,
  Target,
  Zap,
  Download,
  X,
  Save,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MessageSquare } from "lucide-react"

// Mock data - substituir por dados reais do Firebase
const mockData = {
  user: {
    name: "Maria Silva",
    profession: "Manicure Profissional",
    avatar: "/placeholder.svg?height=40&width=40",
    plan: "Profissional",
  },
  metrics: {
    totalQuotes: 47,
    monthlyQuotes: 12,
    responseRate: 78,
    conversionRate: 65,
    totalRevenue: 3450.0,
    monthlyRevenue: 890.0,
    avgQuoteValue: 72.5,
    pendingQuotes: 5,
  },
  recentQuotes: [
    {
      id: "1",
      clientName: "Ana Costa",
      service: "Manicure + Pedicure Completa",
      value: 55.0,
      status: "pending",
      createdAt: "2024-01-20",
      viewCount: 3,
      lastViewed: "2024-01-20T14:30:00",
    },
    {
      id: "2",
      clientName: "Carla Santos",
      service: "Pacote Noiva - Mãos e Pés",
      value: 120.0,
      status: "accepted",
      createdAt: "2024-01-19",
      viewCount: 8,
      lastViewed: "2024-01-19T16:45:00",
    },
    {
      id: "3",
      clientName: "Juliana Lima",
      service: "Manicure Simples",
      value: 25.0,
      status: "viewed",
      createdAt: "2024-01-18",
      viewCount: 2,
      lastViewed: "2024-01-18T10:15:00",
    },
    {
      id: "4",
      clientName: "Patricia Oliveira",
      service: "Pedicure + Esmaltação",
      value: 40.0,
      status: "expired",
      createdAt: "2024-01-15",
      viewCount: 1,
      lastViewed: "2024-01-15T09:20:00",
    },
  ],
  monthlyGoal: {
    target: 15,
    current: 12,
    revenue: {
      target: 1200,
      current: 890,
    },
  },
}

const statusConfig = {
  pending: { label: "Aguardando", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  viewed: { label: "Visualizado", color: "bg-blue-100 text-blue-800", icon: Eye },
  accepted: { label: "Aceito", color: "bg-green-100 text-green-800", icon: CheckCircle },
  expired: { label: "Expirado", color: "bg-gray-100 text-gray-800", icon: Clock },
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [editableGoals, setEditableGoals] = useState([
    {
      id: "1",
      title: "Orçamentos Mensais",
      target: mockData.monthlyGoal.target,
      current: mockData.monthlyGoal.current,
      type: "number",
      icon: Send,
    },
    {
      id: "2",
      title: "Receita Mensal",
      target: mockData.monthlyGoal.revenue.target,
      current: mockData.monthlyGoal.revenue.current,
      type: "currency",
      icon: DollarSign,
    },
  ])
  const [showExcelMessage, setShowExcelMessage] = useState(false)

  const filteredQuotes = mockData.recentQuotes.filter((quote) => {
    const matchesSearch =
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const goalProgress = (mockData.monthlyGoal.current / mockData.monthlyGoal.target) * 100
  const revenueProgress = (mockData.monthlyGoal.revenue.current / mockData.monthlyGoal.revenue.target) * 100

  const handleEditQuote = (quoteId: string) => {
    // TODO: Implementar edição
    console.log("Editando orçamento:", quoteId)
  }

  const handleDeleteQuote = (quoteId: string) => {
    // TODO: Implementar exclusão
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      console.log("Excluindo orçamento:", quoteId)
    }
  }

  const handleOpenChat = (quoteId: string) => {
    // TODO: Implementar chat
    console.log("Abrindo chat para orçamento:", quoteId)
  }

  const handleSaveGoals = () => {
    // TODO: Salvar no Firebase
    setIsEditingGoals(false)
    console.log("Metas salvas:", editableGoals)
  }

  const handleCancelEdit = () => {
    // Restaurar valores originais
    setEditableGoals([
      {
        id: "1",
        title: "Orçamentos Mensais",
        target: mockData.monthlyGoal.target,
        current: mockData.monthlyGoal.current,
        type: "number",
        icon: Send,
      },
      {
        id: "2",
        title: "Receita Mensal",
        target: mockData.monthlyGoal.revenue.target,
        current: mockData.monthlyGoal.revenue.current,
        type: "currency",
        icon: DollarSign,
      },
    ])
    setIsEditingGoals(false)
  }

  const addNewGoal = () => {
    const newGoal = {
      id: Date.now().toString(),
      title: "Nova Meta",
      target: 0,
      current: 0,
      type: "number" as const,
      icon: Target,
    }
    setEditableGoals([...editableGoals, newGoal])
  }

  const updateGoal = (id: string, field: string, value: any) => {
    setEditableGoals(editableGoals.map((goal) => (goal.id === id ? { ...goal, [field]: value } : goal)))
  }

  const deleteGoal = (id: string) => {
    setEditableGoals(editableGoals.filter((goal) => goal.id !== id))
  }

  const handleExcelExport = () => {
    setShowExcelMessage(true)
    setTimeout(() => setShowExcelMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bem-vinda de volta, {mockData.user.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Plano {mockData.user.plan}
              </Badge>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
            <TabsTrigger value="analytics">Relatórios</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orçamentos Este Mês</CardTitle>
                  <Send className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.monthlyQuotes}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                  <Eye className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.responseRate}%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.conversionRate}%</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Este Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockData.metrics.monthlyRevenue)}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% vs mês anterior
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Progresso das Metas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Meta de Orçamentos
                  </CardTitle>
                  <CardDescription>Progresso mensal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        {mockData.monthlyGoal.current} de {mockData.monthlyGoal.target} orçamentos
                      </span>
                      <span>{Math.round(goalProgress)}%</span>
                    </div>
                    <Progress value={goalProgress} className="h-3" />
                    <p className="text-xs text-gray-600">
                      Faltam {mockData.monthlyGoal.target - mockData.monthlyGoal.current} orçamentos para atingir sua
                      meta
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Meta de Receita
                  </CardTitle>
                  <CardDescription>Progresso mensal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        {formatCurrency(mockData.monthlyGoal.revenue.current)} de{" "}
                        {formatCurrency(mockData.monthlyGoal.revenue.target)}
                      </span>
                      <span>{Math.round(revenueProgress)}%</span>
                    </div>
                    <Progress value={revenueProgress} className="h-3" />
                    <p className="text-xs text-gray-600">
                      Faltam{" "}
                      {formatCurrency(mockData.monthlyGoal.revenue.target - mockData.monthlyGoal.revenue.current)} para
                      atingir sua meta
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orçamentos Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Orçamentos Recentes</CardTitle>
                <CardDescription>Seus últimos orçamentos enviados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentQuotes.slice(0, 3).map((quote) => {
                    const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig].icon
                    return (
                      <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                            <AvatarFallback>
                              {quote.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{quote.clientName}</p>
                            <p className="text-sm text-gray-600">{quote.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(quote.value)}</p>
                            <p className="text-xs text-gray-500">{quote.viewCount} visualizações</p>
                          </div>
                          <Badge
                            className={`${statusConfig[quote.status as keyof typeof statusConfig].color} pointer-events-none`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[quote.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("quotes")}>
                    Ver Todos os Orçamentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Orçamentos</CardTitle>
                <CardDescription>Visualize e gerencie todos os seus orçamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por cliente ou serviço..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pending">Aguardando</SelectItem>
                      <SelectItem value="viewed">Visualizado</SelectItem>
                      <SelectItem value="accepted">Aceito</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredQuotes.map((quote) => {
                    const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig].icon
                    return (
                      <Link href={`/quote/${quote.id}`} key={quote.id}>
                        <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                              <AvatarFallback>
                                {quote.clientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{quote.clientName}</p>
                              <p className="text-sm text-gray-600">{quote.service}</p>
                              <p className="text-xs text-gray-500">
                                Criado em {new Date(quote.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(quote.value)}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {quote.viewCount} visualizações
                              </p>
                            </div>
                            <Badge
                              className={`${statusConfig[quote.status as keyof typeof statusConfig].color} pointer-events-none`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[quote.status as keyof typeof statusConfig].label}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/quote/${quote.id}`} className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Visualizar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditQuote(quote.id)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenChat(quote.id)}
                                  className="flex items-center gap-2"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Abrir Chat
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteQuote(quote.id)}
                                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Estatísticas Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total de Orçamentos</span>
                    <span className="font-semibold">{mockData.metrics.totalQuotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receita Total</span>
                    <span className="font-semibold">{formatCurrency(mockData.metrics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Médio por Orçamento</span>
                    <span className="font-semibold">{formatCurrency(mockData.metrics.avgQuoteValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orçamentos Pendentes</span>
                    <span className="font-semibold text-yellow-600">{mockData.metrics.pendingQuotes}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleExcelExport} className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório Excel
                    </Button>
                    {showExcelMessage && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 text-center">
                        🚧 Ainda em desenvolvimento
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Visualização</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Resposta</span>
                      <span>{mockData.metrics.responseRate}%</span>
                    </div>
                    <Progress value={mockData.metrics.responseRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Conversão</span>
                      <span>{mockData.metrics.conversionRate}%</span>
                    </div>
                    <Progress value={mockData.metrics.conversionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Metas Mensais
                      </CardTitle>
                      <CardDescription>Defina e acompanhe suas metas</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditingGoals ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditingGoals(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={handleSaveGoals}>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {editableGoals.map((goal) => {
                    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
                    const GoalIcon = goal.icon

                    return (
                      <div key={goal.id} className="space-y-3">
                        {isEditingGoals ? (
                          <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                              <Input
                                value={goal.title}
                                onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
                                className="font-medium bg-white"
                                placeholder="Nome da meta"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteGoal(goal.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-gray-600">Meta</Label>
                                <Input
                                  type="number"
                                  value={goal.target}
                                  onChange={(e) => updateGoal(goal.id, "target", Number(e.target.value))}
                                  className="bg-white"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Atual</Label>
                                <Input
                                  type="number"
                                  value={goal.current}
                                  onChange={(e) => updateGoal(goal.id, "current", Number(e.target.value))}
                                  className="bg-white"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                <GoalIcon className="h-4 w-4" />
                                {goal.title}
                              </span>
                              <span className="text-sm text-gray-600">
                                {goal.type === "currency"
                                  ? `${formatCurrency(goal.current)}/${formatCurrency(goal.target)}`
                                  : `${goal.current}/${goal.target}`}
                              </span>
                            </div>
                            <Progress value={progress} className="h-3" />
                            <p className="text-xs text-gray-600 mt-1">
                              {progress >= 100
                                ? "🎉 Meta atingida!"
                                : goal.type === "currency"
                                  ? `Faltam ${formatCurrency(goal.target - goal.current)}`
                                  : `Faltam ${goal.target - goal.current} ${goal.title.toLowerCase()}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {isEditingGoals && (
                    <Button variant="outline" onClick={addNewGoal} className="w-full border-dashed">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Nova Meta
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Dicas para Melhorar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">💡 Aumente sua taxa de conversão</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Adicione mais detalhes nas descrições dos seus serviços
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">📈 Otimize seus preços</p>
                    <p className="text-xs text-green-700 mt-1">Seu valor médio está 15% abaixo do mercado</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">⚡ Responda mais rápido</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Clientes que recebem resposta em até 2h convertem 40% mais
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
