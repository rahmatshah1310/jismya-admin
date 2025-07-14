'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true) // <-- Added

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      setCart(stored ? JSON.parse(stored) : [])
    } catch {
      setCart([])
    } finally {
      setLoading(false) 
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, loading])


 const addToCart = (newItem) => {
  setCart((prevCart) => {
    const exists = prevCart.find((item) =>
      item.id === newItem.id && item.selectedOption === newItem.selectedOption
    )
    if (exists) {
      return prevCart.map((item) =>
        item.id === newItem.id && item.selectedOption === newItem.selectedOption
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      )
    }
    return [...prevCart, newItem]
  })
}



  // Update item
  const updateItem = (updatedItem) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    )
  }

  // Remove item
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  return (
    <CartContext.Provider value={{ cart,addToCart, updateItem, removeItem, setCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
