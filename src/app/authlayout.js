'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/layouts/Header'
import { useAuth } from '@/context/AuthContext'

export default function AuthLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/login' || pathname === '/register'

  useEffect(() => {
    if (loading) return

    if (isAuthenticated() && isAuthPage) {
      router.push('/dashboard')
    } else if (!isAuthenticated() && !isAuthPage) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, pathname, isAuthPage, router])

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={`flex-grow bg-white ${!isAuthPage ? 'mt-24' : ''}`}>
        {loading ? (
          <div className="h-[70vh] flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
