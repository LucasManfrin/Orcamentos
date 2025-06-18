export function generateQuoteLink(quoteId: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/quote/${quoteId}`
}

export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2).replace(".", ",")}`
}

export function generateWhatsAppMessage(quote: any): string {
  const services = quote.services.map((s: any) => s.name).join(" + ")
  const total = formatPrice(quote.total)

  return encodeURIComponent(`Olá! Vi seu orçamento de ${services} por ${total}. Gostaria de mais informações!`)
}

export function calculateQuoteTotal(services: Service[]): number {
  return services.reduce((sum, service) => sum + service.price, 0)
}

interface Service {
  price: number
}
