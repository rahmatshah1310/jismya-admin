'use client'

import { useUpdateOrder } from '@/app/api/orderApi'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export default function EditShippingModal({ showModal, onClose, orderData }) {
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    completeAddress: '',
  })

  const updateOrderMutation = useUpdateOrder()

  useEffect(() => {
    if (orderData) {
      setShipping({
        name: orderData.shippingAddress?.name || '',
        email: orderData.shippingAddress?.email || '',
        phone: orderData.shippingAddress?.phone || '',
        country: orderData.shippingAddress?.country || '',
        city: orderData.shippingAddress?.city || '',
        completeAddress: orderData.shippingAddress?.completeAddress || '',
      })
    }
  }, [orderData])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOrderMutation.mutate(
      { id: orderData._id, data: { shippingAddress: shipping } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Edit Shipping Address</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'phone', 'country', 'city', 'completeAddress'].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <Input
                  value={shipping[field]}
                  onChange={(e) =>
                    setShipping({ ...shipping, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}

          <button
            type="submit"
            disabled={updateOrderMutation.isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {updateOrderMutation.isPending ? 'Updating...' : 'Update Shipping'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
