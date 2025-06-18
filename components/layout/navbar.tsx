"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calculator, Home, Plus, BarChart3, Settings, LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">OrçaFácil</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/create"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard/create") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Plus className="h-4 w-4" />
              Criar Orçamento
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard/analytics") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
