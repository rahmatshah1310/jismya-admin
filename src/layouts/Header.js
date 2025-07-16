"use client"

import { useState } from 'react'
import Link from 'next/link'
import InputField from '@/components/ui/InputField'
import { BsThreeDotsVertical } from "react-icons/bs"
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Banners Management' },
  { href: '#product', label: 'Product Management' },
  { href: '#statistics', label: 'Statistics' },
  { href: '#order', label: 'Orders' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
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

          {/* Search Bar (Mobile Only) */}
          <div className=" px-4 pb-3">
            <InputField
              placeholder="Search products"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* Right Controls */}
          <div className="md:hidden flex items-center">
            <Button
              className="text-2xl text-pink-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <BsThreeDotsVertical />
            </Button>
          </div>
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
