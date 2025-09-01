// components/ProtectedRoute.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { userData, token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if we have both token and userData
    if (!loading && (!token || !userData)) {
      // Clear any invalid data from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      router.push('/login')
      return
    }

    // Additional validation: check if token exists in localStorage
    const storedToken = localStorage.getItem('accessToken')
    if (!loading && !storedToken) {
      router.push('/login')
      return
    }
  }, [userData, token, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!token || !userData) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
