"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BsThreeDotsVertical } from "react-icons/bs"
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Banners Management' },
  { href: '/product', label: 'Product Management' },
  { href: '#statistics', label: 'Statistics' },
  { href: '#order', label: 'Orders' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header>
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto py-2 flex items-center justify-between">
          <div className="font-bold text-xl text-pink-600 pl-4">Admin</div>

          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-pink-500 hover:text-pink-700">
                {label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              className="text-2xl text-pink-500"
              onClick={(e) => {
                e.stopPropagation(); // prevent immediate close
                setMenuOpen(!menuOpen)
              }}
              aria-label="Toggle menu"
            >
              <BsThreeDotsVertical />
            </Button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-[70px] right-0 md:hidden bg-amber-50 shadow-lg px-5 py-4 space-y-4 w-44 z-50"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-pink-500 hover:text-pink-700"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header
