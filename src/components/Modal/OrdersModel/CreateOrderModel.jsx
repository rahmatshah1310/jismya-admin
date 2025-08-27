'use client'

import { useCreateOrder } from '@/app/api/orderApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function CreateOrderModal({ showModal, onClose }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    completeAddress: '',
  })

  const [items, setItems] = useState([
    { productId: '', quantity: 1, totalPrice: 0 },
  ])
  const [totalAmount, setTotalAmount] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [notes, setNotes] = useState('')

  const createOrderMutation = useCreateOrder() // ✅ actual mutation hook

  const resetForm = () => {
    setUser({
      name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      completeAddress: '',
    })
    setItems([{ productId: '', quantity: 1, totalPrice: 0 }])
    setTotalAmount(0)
    setShippingMethod('standard')
    setNotes('')
  }

  const addItem = () =>
    setItems([...items, { productId: '', quantity: 1, totalPrice: 0 }])

  const handleItemChange = (index, field, value) => {
    const copy = [...items]
    copy[index][field] =
      field === 'quantity' || field === 'totalPrice' ? +value : value
    setItems(copy)
    const total = copy.reduce((acc, item) => acc + item.totalPrice, 0)
    setTotalAmount(total)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = { user, items, totalAmount, shippingMethod, notes }

    // ✅ Use actual mutation
    createOrderMutation.mutate(body, {
      onSuccess: () => {
        resetForm()
        onClose()
      },
    })
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Create New Order</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {/* Customer Info */}
          <div>
            <h2 className="font-semibold">Customer Info</h2>
            {[
              'name',
              'email',
              'phone',
              'country',
              'city',
              'completeAddress',
            ].map((field) => (
              <Input
                key={field}
                placeholder={field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                value={user[field]}
                type={field === 'email' ? 'email' : 'text'}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                className="border p-2 w-full mt-2"
              />
            ))}
          </div>

          {/* Order Items */}
          <div>
            <h2 className="font-semibold">Order Items</h2>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  label="Product ID"
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(i, 'productId', e.target.value)
                  }
                  className="border p-2"
                />
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(i, 'quantity', e.target.value)
                  }
                  className="border p-2"
                />
                <Input
                  label="Total Price"
                  type="number"
                  placeholder="Total Price"
                  value={item.totalPrice}
                  onChange={(e) =>
                    handleItemChange(i, 'totalPrice', e.target.value)
                  }
                  className="border p-2"
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={addItem}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              + Add Item
            </Button>
          </div>

          {/* Shipping & Notes */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Shipping Method"
              placeholder="Shipping Method"
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="border p-2 w-full mt-2"
            />
            <Input
              label="Notes"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full mt-2"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-medium">
              Total Amount: Rs.{totalAmount.toFixed(2)}
            </span>
            <button
              type="submit"
              disabled={createOrderMutation.isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {createOrderMutation.isLoading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
