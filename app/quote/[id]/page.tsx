"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Check, Loader2, AlertCircle } from "lucide-react"
import { getQuoteById, incrementQuoteViews } from "@/lib/services/quotes"
import { getUserData } from "@/lib/services/auth"
import type { Quote, User } from "@/lib/types"

export default function QuoteViewPage() {
  const params = useParams()
  const quoteId = params.id as string

  const [quote, setQuote] = useState<Quote | null>(null)
  const [professional, setProfessional] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuote() {
      if (!quoteId) return

      setLoading(true)
      setError(null)

      try {
        // Buscar orçamento
        const quoteResult = await getQuoteById(quoteId)

        if (!quoteResult.success || !quoteResult.quote) {
          setError(quoteResult.error || "Orçamento não encontrado")
          return
        }

        setQuote(quoteResult.quote)

        // Buscar dados do profissional
        const professionalData = await getUserData(quoteResult.quote.userId)
        if (professionalData) {
          setProfessional(professionalData)
        }

        // Incrementar visualizações (apenas uma vez por sessão)
        const viewedKey = `quote_viewed_${quoteId}`
        if (!sessionStorage.getItem(viewedKey)) {
          await incrementQuoteViews(quoteId)
          sessionStorage.setItem(viewedKey, "true")
        }
      } catch (err) {
        console.error("Erro ao carregar orçamento:", err)
        setError("Erro inesperado ao carregar orçamento")
      } finally {
        setLoading(false)
      }
    }

    loadQuote()
  }, [quoteId])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const generateWhatsAppMessage = () => {
    if (!quote || !professional) return ""

    const services = quote.services.map((s) => s.name).join(" + ")
    const total = formatCurrency(quote.total)

    return encodeURIComponent(
      `Olá ${professional.name}! Vi seu orçamento de ${services} por ${total}. Gostaria de mais informações!`,
    )
  }

  const handleWhatsAppClick = () => {
    if (!professional?.whatsapp) {
      alert("WhatsApp não disponível para este profissional")
      return
    }

    const message = generateWhatsAppMessage()
    const whatsappNumber = professional.whatsapp.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, "_blank")
  }

  const handleEmailClick = () => {
    if (!professional?.email) {
      alert("Email não disponível para este profissional")
      return
    }

    const subject = encodeURIComponent("Interesse no seu orçamento")
    const body = encodeURIComponent(
      `Olá ${professional.name}!\n\nVi seu orçamento e gostaria de mais informações.\n\nObrigado!`,
    )

    window.location.href = `mailto:${professional.email}?subject=${subject}&body=${body}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando orçamento...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Orçamento não encontrado
            </CardTitle>
            <CardDescription>
              {error || "Este orçamento pode ter sido removido ou o link está incorreto"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if quote is expired
  const isExpired = new Date() > new Date(quote.validUntil)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamento Profissional</h1>
          <p className="text-gray-600">Preparado especialmente para você por {professional?.name || "Profissional"}</p>
          {isExpired && (
            <Badge variant="destructive" className="mt-2">
              Orçamento Expirado
            </Badge>
          )}
        </div>

        {/* Professional Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{professional?.name || "Profissional"}</CardTitle>
                <CardDescription>{professional?.profession || "Prestador de Serviços"}</CardDescription>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 flex-wrap">
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
          </CardHeader>
        </Card>

        {/* Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Serviços Inclusos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote.services.map((service, index) => (
              <div
                key={service.id}
                className="flex justify-between items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  {service.description && <p className="text-sm text-gray-600 mt-1">{service.description}</p>}
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
              <span className="text-blue-600">{formatCurrency(quote.total)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Orçamento válido até {new Date(quote.validUntil).toLocaleDateString("pt-BR")}
            </p>
            {quote.viewCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Este orçamento foi visualizado {quote.viewCount} vez{quote.viewCount !== 1 ? "es" : ""}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Contact Actions */}
        <div className="space-y-4">
          {!isExpired ? (
            <>
              <Button
                className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 shadow-lg"
                onClick={handleWhatsAppClick}
                disabled={!professional?.whatsapp}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {professional?.whatsapp ? "Aceitar via WhatsApp" : "WhatsApp não disponível"}
              </Button>

              <Button variant="outline" className="w-full" onClick={handleEmailClick} disabled={!professional?.email}>
                <Mail className="h-5 w-5 mr-2" />
                {professional?.email ? "Solicitar Mais Informações" : "Email não disponível"}
              </Button>
            </>
          ) : (
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-800 font-medium">Este orçamento expirou</p>
              <p className="text-red-600 text-sm mt-1">
                Entre em contato diretamente com o profissional para solicitar um novo orçamento
              </p>
              {professional?.whatsapp && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const message = encodeURIComponent(
                      `Olá ${professional.name}! Gostaria de solicitar um novo orçamento.`,
                    )
                    const whatsappNumber = professional.whatsapp!.replace(/\D/g, "")
                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contatar via WhatsApp
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Orçamento criado em {new Date(quote.createdAt).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-xs text-gray-400 mt-1">Powered by OrçaFácil</p>
        </div>
      </div>
    </div>
  )
}
