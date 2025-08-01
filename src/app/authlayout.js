'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/layouts/Header'
import { useAuth } from '@/context/AuthContext'
import { ClipLoader } from 'react-spinners'

export default function AuthLayout({ children }) {
  const { userData, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/login' || pathname === '/register'

useEffect(() => {
  if (loading) return;

  if (userData) {
    if (isAuthPage) router.push('/');
  } else {
    if (!isAuthPage&&!loading) router.push('/login');
  }
}, [userData, loading, pathname, isAuthPage, router]);

  if (loading) {
    return <div className="h-screen flex justify-center items-center"><ClipLoader/></div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={`flex-grow bg-white ${!isAuthPage ? 'mt-24' : ''}`}>
        {children}
      </main>
    </div>
  )
}
