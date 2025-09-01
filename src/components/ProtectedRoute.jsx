// components/ProtectedRoute.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
  const { userData, token, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only check authentication when loading is complete
    if (loading) return

    // Check if user is authenticated using the context method
    if (!isAuthenticated()) {
      // Clear any invalid data from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      router.push('/login')
      return
    }

    // Additional validation: check if token exists in localStorage
    const storedToken = localStorage.getItem('accessToken')
    if (!storedToken) {
      router.push('/login')
      return
    }
  }, [userData, token, loading, router, isAuthenticated])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated()) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
