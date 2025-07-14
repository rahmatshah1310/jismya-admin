"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import InputField from '@/components/ui/InputField'
import { BsThreeDotsVertical } from "react-icons/bs"
import Button from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#categories', label: 'Categories' },
  { href: '#new-arrivals', label: 'New Arrivals' },
  { href: '#sale', label: 'Sale' },
  { href: '#about', label: 'About Us' },
  { href: '#return-policy', label: 'Return Policy' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header>
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-xl text-pink-600">Admin</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-pink-500 hover:text-pink-700">
                {label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <Link href="#account" className="text-pink-500 hover:text-pink-700">
              <i className="fas fa-user"></i>
            </Link>
            <Link href="/added-product" className="relative text-pink-500 hover:text-pink-700">
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            <Button
              className="md:hidden text-2xl text-pink-500 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <BsThreeDotsVertical />
            </Button>
          </div>
        </div>

        {/* Search Bar (Mobile Only) */}
        <div className="md:hidden px-4 pb-3">
          <InputField
            placeholder="Search products"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="fixed top-[70px] right-0 md:hidden bg-amber-50 shadow-lg px-5 py-4 space-y-4 w-44 z-50">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="block text-pink-500 hover:text-pink-700">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
