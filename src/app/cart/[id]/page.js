'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ClipLoader } from 'react-spinners'

export default function SingleCartItem() {
  const { id } = useParams()
  const router = useRouter()
  const { cart, updateItem, removeItem, loading } = useCart()
  const cartItem = cart.find((item) => item.id === String(id))

  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity || 1)
      setSelectedOption(cartItem.selectedOption || '')
    }
  }, [cartItem])

  if (loading)
    return (
      <h1 className="text-center py-20">
        <ClipLoader />
      </h1>
    )
  if (!cartItem) return <h1 className="text-center py-20">Item not found.</h1>

  const handleUpdateCart = () => {
    updateItem({ ...cartItem, quantity, selectedOption })
    alert('Cart updated successfully!')
  }

  const handleRemove = () => {
    removeItem(cartItem.id)
    alert('Item removed from cart')
    router.push('/')
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Image */}
          <div className="flex justify-center items-center lg:w-1/2">
            <Image
              src={cartItem.image}
              alt={cartItem.name}
              width={300}
              height={300}
              className="rounded-md object-cover w-full max-w-sm bg-gray-100"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {cartItem.name}
              </h1>
              <p className="text-xl text-pink-600 font-semibold mb-4">
                Rs. {cartItem.price.toLocaleString()}
              </p>

              <div className="text-gray-600 mb-4 space-y-1 text-sm sm:text-base">
                <div>
                  <strong>Ships In:</strong> {cartItem.delivery}
                </div>
                <div>
                  <strong>Delivery Area:</strong> {cartItem.area}
                </div>
                <div>
                  <strong>Origin:</strong> {cartItem.origin}
                </div>
                <div>
                  <strong>Shipped By:</strong> {cartItem.shippedBy}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <label className="font-semibold block mb-1">Size:</label>
                <select
                  className="w-full sm:w-1/2 border border-gray-300 rounded px-2 py-2"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="">Choose an Option...</option>
                  {cartItem.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="font-semibold block mb-1">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full sm:w-24 px-2 py-2 border border-gray-300 rounded"
                >
                  {(cartItem.availableQuantities || ['1', '2', '3', '4']).map(
                    (qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* <div className="mb-4 flex items-center gap-2">
                <label className="font-semibold">Qty:</label>
                <InputField
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
              </div> */}

            {/* <button
                onClick={handleUpdateCart}
                className="bg-[var(--color-pink-500)] hover:bg-[var(--color-pink-600)] text-white px-6 py-2 mt-2 rounded-md font-medium transition-colors"
              >
                Update
              </button> */}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleRemove}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition"
              >
                Remove
              </button>
              <button
                onClick={handleUpdateCart}
                className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md font-semibold transition"
              >
                Update
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold transition"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
