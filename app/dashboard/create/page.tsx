"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  description: string
  price: number
}

export default function CreateQuotePage() {
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

  const [services, setServices] = useState<Service[]>([{ id: "1", name: "", description: "", price: 0 }])

  const addService = () => {
    setServices([
      ...services,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        price: 0,
      },
    ])
  }

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const handlePriceChange = (id: string, formattedValue: string) => {
    const numericValue = parseCurrencyInput(formattedValue)
    updateService(id, "price", numericValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Salvar no Firebase e gerar link
    console.log("Criando orçamento:", services)
  }

  const total = services.reduce((sum, service) => sum + service.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Criar Novo Orçamento</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
              <CardDescription>Adicione os serviços incluídos no orçamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {services.map((service, index) => (
                <div key={service.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Serviço {index + 1}</h3>
                    {services.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor={`name-${service.id}`}>Nome do Serviço</Label>
                      <Input
                        id={`name-${service.id}`}
                        value={service.name}
                        onChange={(e) => updateService(service.id, "name", e.target.value)}
                        placeholder="Ex: Manicure + Pedicure"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${service.id}`}>Descrição</Label>
                      <Textarea
                        id={`description-${service.id}`}
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Descreva o que está incluso no serviço..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`price-${service.id}`}>Preço</Label>
                      <Input
                        id={`price-${service.id}`}
                        value={service.price > 0 ? formatCurrency(service.price) : ""}
                        onChange={(e) => handlePriceChange(service.id, e.target.value)}
                        placeholder="R$ 0,00"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addService} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Criar Orçamento
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
