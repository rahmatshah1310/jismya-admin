'use client'
import React, { useEffect, useState } from 'react'
import { useLoginMutation } from '../api/authApi'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const isLoading = loginMutation.isPending
  const { userData, setAuthData } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (loginMutation.status === 'success') {
      setAuthData(loginMutation.data)
    }
  }, [loginMutation.status, loginMutation.data, setAuthData])

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const res = await loginMutation.mutateAsync({ email, password })
      toast.success(res?.message || 'Login Successful')
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4 py-10">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-1/4 font-roboto">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-[var(--light-green)]">
          <div className="p-6 sm:p-8">
            <div className="text-center space-y-1 mb-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[var(--light-green)]/10 flex items-center justify-center">
                <span className="text-[var(--light-green)] font-bold">JA</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-600">Sign in to your dashboard</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="p-3 w-full bg-gray-50 rounded border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--light-green)] focus:border-[var(--light-green)]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[var(--light-green)] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="p-3 w-full bg-gray-50 rounded border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--light-green)] focus:border-[var(--light-green)] pr-24"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 my-1 px-3 text-xs font-medium rounded-md text-gray-700 hover:text-gray-900 bg-white border hover:bg-gray-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full bg-background"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Protected area of <span className="font-semibold text-gray-700">Jismya Admin</span>
        </p>
      </div>
    </div>
  )
}
