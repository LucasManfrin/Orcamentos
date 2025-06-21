export interface User {
  id: string
  name: string
  email: string
  profession: string
  whatsapp?: string
  createdAt: Date
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
}

export interface Quote {
  id: string
  userId: string
  title?: string
  services: Service[]
  total: number
  status: "draft" | "sent" | "viewed" | "responded" | "accepted"
  createdAt: Date
  validUntil: Date
  viewCount: number
  lastViewed?: Date
  responses?: QuoteResponse[]
}

export interface QuoteResponse {
  id: string
  quoteId: string
  clientName?: string
  clientContact: string
  message: string
  createdAt: Date
  type: "whatsapp" | "email" | "chat"
}

export interface DashboardStats {
  totalQuotes: number
  monthlyQuotes: number
  responseRate: number
  totalValue: number
}
