"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  TrendingUp,
  Eye,
  Share,
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MessageSquare } from "lucide-react"
import { useAuth, getUserData } from "@/lib/services/auth"
import { getUserQuotes, deleteQuote } from "@/lib/services/quotes"
import type { Quote, User } from "@/lib/types"

const statusConfig = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-800", icon: Clock },
  sent: { label: "Enviado", color: "bg-blue-100 text-blue-800", icon: Send },
  viewed: { label: "Visualizado", color: "bg-purple-100 text-purple-800", icon: Eye },
  responded: { label: "Respondido", color: "bg-yellow-100 text-yellow-800", icon: MessageSquare },
  accepted: { label: "Aceito", color: "bg-green-100 text-green-800", icon: CheckCircle },
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function DashboardPage() {
  const { user, loading: authLoading, initialized } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Estados para dados do Firebase
  const [userData, setUserData] = useState<User | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para metas (mantendo funcionalidade existente)
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [editableGoals, setEditableGoals] = useState([
    {
      id: "1",
      title: "Orçamentos Mensais",
      target: 15,
      current: 0,
      type: "number",
      icon: Send,
    },
    {
      id: "2",
      title: "Receita Mensal",
      target: 1200,
      current: 0,
      type: "currency",
      icon: DollarSign,
    },
  ])
  const [showExcelMessage, setShowExcelMessage] = useState(false)

  // Carregar dados do usuário e orçamentos
  useEffect(() => {
    async function loadData() {
      if (!user || !initialized) {
        console.log("⚠️ Usuário não disponível ou não inicializado")
        return
      }

      console.log("🔄 Carregando dados do dashboard...")
      setLoading(true)
      setError(null)

      try {
        // Carregar dados do usuário
        console.log("🔄 Carregando dados do usuário...")
        const userDataResult = await getUserData(user.uid)
        if (userDataResult) {
          console.log("✅ Dados do usuário carregados")
          setUserData(userDataResult)
        } else {
          console.log("⚠️ Dados do usuário não encontrados")
        }

        // Carregar orçamentos
        console.log("🔄 Carregando orçamentos...")
        const quotesResult = await getUserQuotes(user.uid)
        if (quotesResult.success && quotesResult.quotes) {
          console.log("✅ Orçamentos carregados:", quotesResult.quotes.length)
          setQuotes(quotesResult.quotes)

          // Atualizar metas com dados reais
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()

          const monthlyQuotes = quotesResult.quotes.filter((quote) => {
            const quoteDate = new Date(quote.createdAt)
            return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear
          })

          const monthlyRevenue = monthlyQuotes.reduce((sum, quote) => sum + quote.total, 0)

          setEditableGoals((prev) => [
            { ...prev[0], current: monthlyQuotes.length },
            { ...prev[1], current: monthlyRevenue },
          ])
        } else {
          console.error("❌ Erro ao carregar orçamentos:", quotesResult.error)
          setError(quotesResult.error || "Erro ao carregar orçamentos")
        }
      } catch (err) {
        console.error("❌ Erro inesperado ao carregar dados:", err)
        setError("Erro inesperado ao carregar dados")
      } finally {
        setLoading(false)
        console.log("✅ Carregamento do dashboard finalizado")
      }
    }

    if (initialized) {
      loadData()
    }
  }, [user, initialized])

  // Calcular métricas
  const metrics = {
    totalQuotes: quotes.length,
    monthlyQuotes: quotes.filter((quote) => {
      const quoteDate = new Date(quote.createdAt)
      const now = new Date()
      return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear()
    }).length,
    responseRate:
      quotes.length > 0
        ? Math.round(
            (quotes.filter((q) => q.status === "responded" || q.status === "accepted").length / quotes.length) * 100,
          )
        : 0,
    conversionRate:
      quotes.length > 0 ? Math.round((quotes.filter((q) => q.status === "accepted").length / quotes.length) * 100) : 0,
    totalRevenue: quotes.reduce((sum, quote) => sum + quote.total, 0),
    monthlyRevenue: quotes
      .filter((quote) => {
        const quoteDate = new Date(quote.createdAt)
        const now = new Date()
        return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, quote) => sum + quote.total, 0),
    avgQuoteValue: quotes.length > 0 ? quotes.reduce((sum, quote) => sum + quote.total, 0) / quotes.length : 0,
    pendingQuotes: quotes.filter((q) => q.status === "sent" || q.status === "viewed").length,
  }

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = quote.services.some((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const goalProgress = editableGoals[0].target > 0 ? (editableGoals[0].current / editableGoals[0].target) * 100 : 0
  const revenueProgress = editableGoals[1].target > 0 ? (editableGoals[1].current / editableGoals[1].target) * 100 : 0

  const handleEditQuote = (quoteId: string) => {
    // TODO: Implementar edição
    alert("Em desenvolvimento!")
    console.log("Editando orçamento:", quoteId)
  }

  const handleShareQuote = (quoteId: string) => {
    // TODO: Implementar edição
    alert("Em desenvolvimento!")
    console.log("Editando orçamento:", quoteId)
  }
  
  
  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      const result = await deleteQuote(quoteId)
      if (result.success) {
        setQuotes(quotes.filter((q) => q.id !== quoteId))
        alert("Orçamento excluído com sucesso!")
      } else {
        alert("Erro ao excluir orçamento")
      }
    }
  }

  const handleOpenChat = (quoteId: string) => {
    // TODO: Implementar chat
    alert("Ainda em desenvolvimento")
    console.log("Abrindo chat para orçamento:", quoteId)
  }

  const handleSaveGoals = () => {
    // TODO: Salvar no Firebase
    setIsEditingGoals(false)
    console.log("Metas salvas:", editableGoals)
  }

  const handleCancelEdit = () => {
    // Restaurar valores originais
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyQuotes = quotes.filter((quote) => {
      const quoteDate = new Date(quote.createdAt)
      return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear
    })

    const monthlyRevenue = monthlyQuotes.reduce((sum, quote) => sum + quote.total, 0)

    setEditableGoals([
      {
        id: "1",
        title: "Orçamentos Mensais",
        target: 15,
        current: monthlyQuotes.length,
        type: "number",
        icon: Send,
      },
      {
        id: "2",
        title: "Receita Mensal",
        target: 1200,
        current: monthlyRevenue,
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

  // Loading state inicial
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar o dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Fazer Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  // Loading dashboard data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dashboard...</p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>User: {user?.email}</p>
              <p>UID: {user?.uid}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Erro
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Para debugar tudo
  console.log("UserData:", userData)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Bem-vind{userData?.name?.includes("a") ? "a" : "o"} de volta, {userData?.name || user.email}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {userData?.profession || "Profissional"}
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
            <TabsTrigger value="quotes">Orçamentos ({quotes.length})</TabsTrigger>
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
                  <div className="text-2xl font-bold">{metrics.monthlyQuotes}</div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span>Total: {metrics.totalQuotes}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                  <Eye className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.responseRate}%</div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span>Baseado em {metrics.totalQuotes} orçamentos</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span>{quotes.filter((q) => q.status === "accepted").length} aceitos</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Este Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
                  <div className="flex items-center text-xs text-gray-600">
                    <span>Total: {formatCurrency(metrics.totalRevenue)}</span>
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
                        {editableGoals[0].current} de {editableGoals[0].target} orçamentos
                      </span>
                      <span>{Math.round(goalProgress)}%</span>
                    </div>
                    <Progress value={goalProgress} className="h-3" />
                    <p className="text-xs text-gray-600">
                      {editableGoals[0].target - editableGoals[0].current > 0
                        ? `Faltam ${editableGoals[0].target - editableGoals[0].current} orçamentos para atingir sua meta`
                        : "🎉 Meta atingida!"}
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
                        {formatCurrency(editableGoals[1].current)} de {formatCurrency(editableGoals[1].target)}
                      </span>
                      <span>{Math.round(revenueProgress)}%</span>
                    </div>
                    <Progress value={revenueProgress} className="h-3" />
                    <p className="text-xs text-gray-600">
                      {editableGoals[1].target - editableGoals[1].current > 0
                        ? `Faltam ${formatCurrency(editableGoals[1].target - editableGoals[1].current)} para atingir sua meta`
                        : "🎉 Meta atingida!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orçamentos Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Orçamentos Recentes</CardTitle>
                <CardDescription>Seus últimos orçamentos criados</CardDescription>
              </CardHeader>
              <CardContent>
                {quotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Você ainda não criou nenhum orçamento</p>
                    <Button asChild>
                      <Link href="/dashboard/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Orçamento
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.slice(0, 3).map((quote) => {
                      const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig].icon
                      const mainService = quote.services[0]?.name || "Serviços"
                      const serviceCount = quote.services.length

                      return (
                        <Link href={`/quote/${quote.id}`} key={quote.id}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{mainService.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{mainService}</p>
                                <p className="text-sm text-gray-600">
                                  {serviceCount > 1 ? `+ ${serviceCount - 1} outros serviços` : "Serviço único"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Criado em {new Date(quote.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(quote.total)}</p>
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
                        </Link>
                      )
                    })}
                  </div>
                )}

                {quotes.length > 3 && (
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("quotes")}>
                      Ver Todos os Orçamentos
                    </Button>
                  </div>
                )}
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
                      placeholder="Buscar por serviço..."
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
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="sent">Enviado</SelectItem>
                      <SelectItem value="viewed">Visualizado</SelectItem>
                      <SelectItem value="responded">Respondido</SelectItem>
                      <SelectItem value="accepted">Aceito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredQuotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      {quotes.length === 0
                        ? "Você ainda não criou nenhum orçamento"
                        : "Nenhum orçamento encontrado com os filtros aplicados"}
                    </p>
                    {quotes.length === 0 && (
                      <Button asChild>
                        <Link href="/dashboard/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Primeiro Orçamento
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQuotes.map((quote) => {
                      const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig].icon
                      const mainService = quote.services[0]?.name || "Serviços"
                      const serviceCount = quote.services.length

                      return (
                        <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <Link href={`/quote/${quote.id}`} className="flex items-center gap-4 flex-1 cursor-pointer">
                            <Avatar>
                              <AvatarFallback>{mainService.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{mainService}</p>
                              <p className="text-sm text-gray-600">
                                {serviceCount > 1 ? `+ ${serviceCount - 1} outros serviços` : "Serviço único"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Criado em {new Date(quote.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </Link>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(quote.total)}</p>
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
                                <DropdownMenuItem asChild
                                onClick={() => handleShareQuote(quote.id)}
                                className="flex items-center gap-2"
                                  >
                                  <Share className="h-4 w-4" />
                                    Compartilhar
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
                      )
                    })}
                  </div>
                )}
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
                    <span className="font-semibold">{metrics.totalQuotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receita Total</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Médio por Orçamento</span>
                    <span className="font-semibold">{formatCurrency(metrics.avgQuoteValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orçamentos Pendentes</span>
                    <span className="font-semibold text-yellow-600">{metrics.pendingQuotes}</span>
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
                      <span>
                        {quotes.filter((q) => q.viewCount > 0).length > 0
                          ? Math.round((quotes.filter((q) => q.viewCount > 0).length / quotes.length) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        quotes.filter((q) => q.viewCount > 0).length > 0
                          ? (quotes.filter((q) => q.viewCount > 0).length / quotes.length) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Resposta</span>
                      <span>{metrics.responseRate}%</span>
                    </div>
                    <Progress value={metrics.responseRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Conversão</span>
                      <span>{metrics.conversionRate}%</span>
                    </div>
                    <Progress value={metrics.conversionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab - mantendo funcionalidade existente */}
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
                                <Label className="text-xs text-gray-600">Atual (Automático)</Label>
                                <Input
                                  type="number"
                                  value={goal.current}
                                  disabled
                                  className="bg-gray-100"
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
                    <p className="text-xs text-green-700 mt-1">
                      Valor médio atual: {formatCurrency(metrics.avgQuoteValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">⚡ Crie mais orçamentos</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Você tem {metrics.pendingQuotes} orçamentos aguardando resposta
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
