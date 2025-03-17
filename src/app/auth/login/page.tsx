"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona para a página de seleção de portal
    router.push('/auth/portal-selection')
  }, [router])

  return null // Não renderiza nada pois será redirecionado
} 