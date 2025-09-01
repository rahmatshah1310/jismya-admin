'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { userData, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (userData) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [userData, loading, router])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground">
            Please wait while we redirect you.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
