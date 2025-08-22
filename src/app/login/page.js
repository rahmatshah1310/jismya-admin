'use client'
import React, { useEffect, useState } from 'react'
import { useLoginMutation } from '../api/authApi'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'

export default function Login() {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const isLoading = loginMutation.isPending
  const { userData, setAuthData } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      console.log('Attempting login with:', { email, password })
      const res = await loginMutation.mutateAsync({ email, password })
      console.log('Login response:', res)
      toast.success(res?.message || 'Login Successful')
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/5 font-roboto xl:w-1/4 p-6 sm:p-8 border-[var(--light-green)] border rounded-2xl space-y-4 shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
        {/* Test buttons to verify button clicking works */}
       
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 w-full bg-gray-200 rounded focus:outline-none border text-gray-800"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 w-full bg-gray-200 rounded focus:outline-none border text-gray-800"
          />

          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Log In...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
