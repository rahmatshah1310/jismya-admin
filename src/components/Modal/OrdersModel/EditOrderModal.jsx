'use client'

import { useUpdateOrder } from '@/app/api/orderApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export default function EditOrderModal({ showEditModal, onClose, orderData }) {
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

  const updateOrderMutation = useUpdateOrder()

  useEffect(() => {
    if (orderData) {
      setUser({
        name: orderData.billingAddress?.name || '',
        email: orderData.billingAddress?.email || '',
        phone: orderData.billingAddress?.phone || '',
        country: orderData.billingAddress?.country || '',
        city: orderData.billingAddress?.city || '',
        completeAddress: orderData.billingAddress?.completeAddress || '',
      })
      setItems(
        orderData.items?.length
          ? orderData.items
          : [{ productId: '', quantity: 1, totalPrice: 0 }]
      )
      setTotalAmount(orderData.totalAmount || 0)
      setShippingMethod(orderData.shippingMethod || 'standard')
      setNotes(orderData.notes || '')
    }
  }, [orderData])

  const handleItemChange = (index, field, value) => {
    const copy = [...items]
    copy[index][field] =
      field === 'quantity' || field === 'totalPrice' ? +value : value
    setItems(copy)
    setTotalAmount(copy.reduce((acc, item) => acc + item.totalPrice, 0))
  }

  const addItem = () =>
    setItems([...items, { productId: '', quantity: 1, totalPrice: 0 }])

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = { user, items, totalAmount, shippingMethod, notes }

    // ✅ Use the actual mutation signature { id, data }
    updateOrderMutation.mutate(
      { id: orderData._id, data: body },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={showEditModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle>Edit Order</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4  ">
          {/* Customer Info */}
          <div>
            <h2 className="font-semibold mb-2">Customer Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {' '}
              {[
                'name',
                'email',
                'phone',
                'country',
                'city',
                'completeAddress',
              ].map((field) => (
                <div key={field} className="mb-2 space-y-3">
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium mb-1"
                  >
                    {field
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <Input
                    id={field}
                    value={user[field]}
                    type={field === 'email' ? 'email' : 'text'}
                    onChange={(e) =>
                      setUser({ ...user, [field]: e.target.value })
                    }
                    className="border p-2 w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  label="Product ID"
                  placeholder="Product ID"
                  value={item.productId.productName}
                  onChange={(e) =>
                    handleItemChange(i, 'productName', e.target.value)
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
              disabled={updateOrderMutation.isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
