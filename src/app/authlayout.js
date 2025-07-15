'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { useAuth } from '@/context/AuthContext'

export default function AuthLayout({ children }) {
  const { userData, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/login' || pathname === '/register'

  useEffect(() => {
    if (!loading && userData && isAuthPage) {
      if (userData.role === 'admin') {
        router.push('/')
      } else {
        router.push('/login')
      }
    }
  }, [userData, loading, pathname, isAuthPage, router])

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Header only when not on login/register pages */}
      {!isAuthPage && <Header />}

      <main className={`flex-grow bg-white ${!isAuthPage ? 'mt-24' : ''}`}>
        {children}
      </main>

      {/* Show Footer only when not on login/register pages */}
      {!isAuthPage && <Footer />}
    </div>
  )
}
