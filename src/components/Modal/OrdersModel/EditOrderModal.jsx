'use client'
import { useCreateOrder } from '@/app/api/orderApi'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function EditOrderModal({ showEditModal, onClose }) {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: { line1: '', city: '' },
  })
  const [items, setItems] = useState([
    { productId: '', quantity: 1, price: 0, color: '', size: '', discount: 0 },
  ])
  const [courier, setCourier] = useState({ name: '', trackingNumber: '' })

  // --- Mutation for creating an order ---
  const createOrderMutation = useCreateOrder()
  const resetForm = () => {
    setCustomer({ name: '', phone: '', address: { line1: '', city: '' } })
    setItems([
      {
        productId: '',
        quantity: 1,
        price: 0,
        color: '',
        size: '',
        discount: 0,
      },
    ])
    setCourier({ name: '', trackingNumber: '' })
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        quantity: 1,
        price: 0,
        color: '',
        size: '',
        discount: 0,
      },
    ])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = { customer, items, courier }
    createOrderMutation.mutate(body)
  }

  return (
    <Dialog open={showEditModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {/* Customer Info */}
          <div>
            <h2 className="font-semibold">Customer Info</h2>
            <Input
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              className="border p-2 w-full"
            />
            <Input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className="border p-2 w-full mt-2"
            />
            <Input
              placeholder="Address Line 1"
              value={customer.address.line1}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, line1: e.target.value },
                })
              }
              className="border p-2 w-full mt-2"
            />
            <Input
              placeholder="City"
              value={customer.address.city}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: { ...customer.address, city: e.target.value },
                })
              }
              className="border p-2 w-full mt-2"
            />
          </div>

          {/* Order Items */}
          <div>
            <h2 className="font-semibold">Order Items</h2>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 mb-2">
                <Input
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].productId = e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].quantity = +e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].price = +e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
                <Input
                  placeholder="Color"
                  value={item.color}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].color = e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
                <Input
                  placeholder="Size"
                  value={item.size}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].size = e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
                <Input
                  type="number"
                  placeholder="Discount"
                  value={item.discount}
                  onChange={(e) => {
                    const copy = [...items]
                    copy[i].discount = +e.target.value
                    setItems(copy)
                  }}
                  className="border p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              + Add Item
            </button>
          </div>

          <button
            type="submit"
            disabled={createOrderMutation.isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {createOrderMutation.isLoading ? 'Creating...' : 'Create Order'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
