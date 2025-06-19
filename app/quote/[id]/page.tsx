"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Check } from "lucide-react"

// Mock data - substituir por dados reais do Firebase
const mockQuote = {
  id: "1",
  professional: {
    name: "Maria Silva",
    profession: "Manicure Profissional",
    whatsapp: "+5511999999999",
  },
  services: [
    {
      id: "1",
      name: "Manicure Completa",
      description: "Inclui: Cutícula, esmaltação, hidratação e massagem",
      price: 25.0,
    },
    {
      id: "2",
      name: "Pedicure Completa",
      description: "Inclui: Cutícula, esmaltação, esfoliação e hidratação",
      price: 30.0,
    },
  ],
  total: 55.0,
  createdAt: "2024-01-15",
  validUntil: "2024-02-15",
}

export default function QuoteViewPage() {
  const whatsappMessage = encodeURIComponent(
    `Olá ${mockQuote.professional.name}! Vi seu orçamento de ${mockQuote.services.map((s) => s.name).join(" + ")} por R$ ${mockQuote.total.toFixed(2).replace(".", ",")}. Gostaria de mais informações!`,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamento Profissional</h1>
          <p className="text-gray-600">Preparado especialmente para você por {mockQuote.professional.name}</p>
        </div>

        {/* Professional Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{mockQuote.professional.name}</CardTitle>
                <CardDescription>{mockQuote.professional.profession}</CardDescription>
              </div>
              <Badge variant="secondary">Profissional Verificado</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Serviços Inclusos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockQuote.services.map((service) => (
              <div key={service.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">R$ {service.price.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">R$ {mockQuote.total.toFixed(2).replace(".", ",")}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Orçamento válido até {new Date(mockQuote.validUntil).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        {/* Contact Actions */}
        <div className="space-y-4">
          <Button
            className="w-full text-lg py-6 bg-green-600 hover:bg-green-700"
            onClick={() =>
              window.open(
                `https://wa.me/${mockQuote.professional.whatsapp.replace("+", "")}?text=${whatsappMessage}`,
                "_blank",
              )
            }
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Aceitar via WhatsApp
          </Button>

          <Button variant="outline" className="w-full">
            <Mail className="h-5 w-5 mr-2" />
            Solicitar Mais Informações
          </Button>
        </div>

        {/* Features */}
        <div className="mt-8 p-4 bg-white/50 rounded-lg">
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
      </div>
    </div>
  )
}
