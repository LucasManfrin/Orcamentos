"use client"

import { useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/FirebaseConfig"
import type { User } from "@/lib/types"

// Cadastrar usuário
export async function registerUser(email: string, password: string, userData: Omit<User, "id" | "createdAt">) {
  try {
    console.log("🔄 Criando usuário no Firebase Auth...")
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Usuário criado no Auth, salvando dados no Firestore...")

    const createUserInFirestore = async (user: any) => {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || "", 
      email: user.email,
      createdAt: new Date(),
    })
  }

    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      createdAt: new Date(),
    })

    console.log("✅ Dados salvos no Firestore com sucesso!")
    return { success: true, user }
  } catch (error: any) {
    console.error("❌ Erro no cadastro:", error)
    return { success: false, error: error.message }
  }
}

// Login
export async function loginUser(email: string, password: string) {
  try {
    console.log("🔄 Fazendo login...")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("✅ Login bem-sucedido!")
    return { success: true, user: userCredential.user }
  } catch (error: any) {
    console.error("❌ Erro no login:", error)
    return { success: false, error: error.message }
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error("❌ Erro no logout:", error)
    return { success: false, error: error.message }
  }
}

// Buscar dados do usuário
export async function getUserData(userId: string): Promise<User | null> {
  try {
    console.log("🔄 Buscando dados do usuário:", userId)
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("✅ Dados do usuário encontrados")
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
      } as User
    }

    console.log("⚠️ Dados do usuário não encontrados")
    return null
  } catch (error) {
    console.error("❌ Erro ao buscar dados do usuário:", error)
    return null
  }
}

// Hook para monitorar autenticação - VERSÃO CORRIGIDA
export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.log("🔄 Iniciando monitoramento de autenticação...")

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("🔄 Estado de autenticação mudou:", user ? `Logado como ${user.email}` : "Não logado")
        setUser(user)
        setLoading(false)
        setInitialized(true)
      },
      (error) => {
        console.error("❌ Erro no onAuthStateChanged:", error)
        setLoading(false)
        setInitialized(true)
      },
    )

    // Timeout de segurança
    const timeout = setTimeout(() => {
      if (!initialized) {
        console.log("⚠️ Timeout na inicialização do auth, forçando loading = false")
        setLoading(false)
        setInitialized(true)
      }
    }, 5000) // 5 segundos

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [initialized])

  return { user, loading, initialized }
}
