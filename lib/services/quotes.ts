import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { db } from "@/FirebaseConfig"
import type { Quote, Service } from "@/lib/types"

// Criar novo orçamento
export async function createQuote(userId: string, services: Service[]) {
  try {
    const total = services.reduce((sum, service) => sum + service.price, 0)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30) // Válido por 30 dias

    const quoteData = {
      userId,
      services,
      total,
      status: "draft" as const,
      createdAt: serverTimestamp(),
      validUntil,
      viewCount: 0,
    }

    const docRef = await addDoc(collection(db, "quotes"), quoteData)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Erro ao criar orçamento:", error)
    return { success: false, error: "Erro ao criar orçamento" }
  }
}

// Buscar orçamentos do usuário
export async function getUserQuotes(userId: string) {
  try {
    const q = query(collection(db, "quotes"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const quotes: Quote[] = []

    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        validUntil: doc.data().validUntil?.toDate(),
      } as Quote)
    })

    return { success: true, quotes }
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error)
    return { success: false, error: "Erro ao buscar orçamentos" }
  }
}

// Buscar orçamento por ID (para página pública)
export async function getQuoteById(quoteId: string) {
  try {
    const docRef = doc(db, "quotes", quoteId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: "Orçamento não encontrado" }
    }

    const quote = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      validUntil: docSnap.data().validUntil?.toDate(),
    } as Quote

    return { success: true, quote }
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error)
    return { success: false, error: "Erro ao buscar orçamento" }
  }
}

// Incrementar visualizações
export async function incrementQuoteViews(quoteId: string) {
  try {
    const docRef = doc(db, "quotes", quoteId)
    await updateDoc(docRef, {
      viewCount: increment(1),
      lastViewed: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Erro ao incrementar visualizações:", error)
    return { success: false }
  }
}

// Atualizar status do orçamento
export async function updateQuoteStatus(quoteId: string, status: Quote["status"]) {
  try {
    const docRef = doc(db, "quotes", quoteId)
    await updateDoc(docRef, { status })
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { success: false }
  }
}

// Deletar orçamento
export async function deleteQuote(quoteId: string) {
  try {
    await deleteDoc(doc(db, "quotes", quoteId))
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar orçamento:", error)
    return { success: false }
  }
}
