'use client'

import { useCreateOrder } from '@/app/api/orderApi'
import { useGetAllProducts } from '@/app/api/productApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function CreateOrderModal({ showModal, onClose }) {
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Pakistan',
    city: '',
    completeAddress: '',
  })

  const [items, setItems] = useState([
    { productId: '', quantity: 1, totalPrice: 0 },
  ])
  const [productSearchTerms, setProductSearchTerms] = useState([''])
  const [totalAmount, setTotalAmount] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('standard')

  const createOrderMutation = useCreateOrder()
  const { data: allProductsData } = useGetAllProducts()
  const products = allProductsData?.data || []

  const resetForm = () => {
    setBillingAddress({
      name: '',
      email: '',
      phone: '',
      country: 'Pakistan',
      city: '',
      completeAddress: '',
    })
    setItems([{ productId: '', quantity: 1, totalPrice: 0 }])
    setTotalAmount(0)
    setShippingMethod('standard')
  }

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, totalPrice: 0 }])
    setProductSearchTerms([...productSearchTerms, ''])
  }

  const handleItemChange = (index, field, value) => {
    const copy = [...items]

    // Normalize numeric fields
    const normalizedValue =
      field === 'quantity' || field === 'totalPrice' ? +value : value
    copy[index][field] = normalizedValue

    // If product or quantity changes, recompute item's totalPrice from product price
    if (field === 'productId' || field === 'quantity') {
      const current = copy[index]
      const product = products.find((p) => p._id === current.productId)
      if (product) {
        const price = Number(product.price) || 0
        const qty = Number(current.quantity) || 0
        current.totalPrice = +(price * qty).toFixed(2)
      }
    }

    setItems(copy)
    const total = copy.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0)
    setTotalAmount(total)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Directly proceed without additional frontend validation

    // Recompute totalAmount from items to ensure consistency
    const computedTotal = items.reduce((acc, item) => acc + (Number(item.totalPrice) || 0), 0)
    setTotalAmount(computedTotal)

    const body = { billingAddress, items, totalAmount: computedTotal, shippingMethod, }

   const res=await createOrderMutation.mutateAsync(body, {
      onSuccess: () => {
        toast.success(res?.message || 'Order created successfully')
        resetForm()
        onClose()
      },
      onError: (err) => {
        const message = typeof err === 'string' ? err : (err?.message || 'Failed to create order')
        toast.error(message)
      },
    })
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="pb-3">Create New Order</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {/* Billing Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="ba-name" className="text-sm font-medium text-foreground">Name</label>
              <Input
                id="ba-name"
                placeholder="Name"
                value={billingAddress.name}
                onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                required
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="ba-email" className="text-sm font-medium text-foreground">Email</label>
              <Input
                id="ba-email"
                type="email"
                placeholder="Email"
                value={billingAddress.email}
                onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ba-city" className="text-sm font-medium text-foreground">City</label>
              <Input
                id="ba-city"
                placeholder="City"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                required
                className="border p-2 w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ba-address" className="text-sm font-medium text-foreground">Complete Address</label>
              <Input
                id="ba-address"
                placeholder="Complete Address"
                value={billingAddress.completeAddress}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, completeAddress: e.target.value })
                }
                required
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="ba-phone" className="text-sm font-medium text-foreground">Phone</label>
              <Input
                id="ba-phone"
                placeholder="Phone"
                value={billingAddress.phone}
                onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                required
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="ba-country" className="text-sm font-medium text-foreground">Country</label>
              <Input
                id="ba-country"
                placeholder="Country"
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                required
                className="border p-2 w-full"
              />
            </div>
           
          </div>

          {/* Order Items */}
          <div>
            {items.map((item, i) => {
              const term = productSearchTerms[i] || ''
              const filtered = products.filter((p) =>
                (p.productName || p.name || '').toLowerCase().includes(term.toLowerCase())
              )
              return (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  <div>
                    <label htmlFor={`product-${i}`} className="text-sm font-medium text-foreground">Product</label>
                    <Select
                      value={item.productId}
                      onValueChange={(val) => handleItemChange(i, 'productId', val)}
                      required
                    >
                      <SelectTrigger id={`product-${i}`}>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Search product..."
                            value={term}
                            onChange={(e) => {
                              const next = [...productSearchTerms]
                              next[i] = e.target.value
                              setProductSearchTerms(next)
                            }}
                            className="border p-2 w-full"
                          />
                        </div>
                        {filtered.map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {(p.productName || p.name || 'Unnamed') + ` — Rs.${Number(p.price || 0).toFixed(2)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor={`quantity-${i}`} className="text-sm font-medium text-foreground">Quantity</label>
                    <Input
                      id={`quantity-${i}`}
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(i, 'quantity', e.target.value)
                      }
                      required
                      className="border p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor={`total-${i}`} className="text-sm font-medium text-foreground">Total Price</label>
                    <Input
                      id={`total-${i}`}
                      type="number"
                      placeholder="Total Price"
                      value={item.totalPrice}
                      onChange={(e) =>
                        handleItemChange(i, 'totalPrice', e.target.value)
                      }
                      className="border p-2"
                    />
                  </div>
                </div>
              )
            })}
            <Button
              type="button"
              onClick={addItem}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              + Add Item
            </Button>
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
