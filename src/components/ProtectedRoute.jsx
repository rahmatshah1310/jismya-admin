// components/ProtectedRoute.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { userData,loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
      if (!userData && !loading) {
      router.push('/login')
    }
  }, [userData, router, loading])

  if (!userData && !loading) return null // or loading spinner

  return <>{children}</>
}

export default ProtectedRoute
