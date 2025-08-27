import React, { useState } from 'react'
import { Edit, Pencil, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { useUpdateShippingAddress } from '@/app/api/orderApi'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'

const ShippingAddress = ({ order, shippingAddress, setShippingAddress }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [shipping, setShipping] = useState({
    name: shippingAddress?.name || '',
    email: shippingAddress?.email || '',
    phone: shippingAddress?.phone || '',
    country: shippingAddress?.country || '',
    city: shippingAddress?.city || '',
    completeAddress: shippingAddress?.completeAddress || '',
  })

  const updateOrderMutation = useUpdateShippingAddress()

  const handleEdit = () => {
    setIsEditing(true)
    // Reset form to current values
    setShipping({
      name: shippingAddress?.name || '',
      email: shippingAddress?.email || '',
      phone: shippingAddress?.phone || '',
      country: shippingAddress?.country || '',
      city: shippingAddress?.city || '',
      completeAddress: shippingAddress?.completeAddress || '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
    setShipping({
      name: shippingAddress?.name || '',
      email: shippingAddress?.email || '',
      phone: shippingAddress?.phone || '',
      country: shippingAddress?.country || '',
      city: shippingAddress?.city || '',
      completeAddress: shippingAddress?.completeAddress || '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateOrderMutation.mutateAsync({
        orderId: order.orderId,
        shippingAddress: shipping,
      })
      toast.success(res?.message || 'Shipping address updated successfully!')
      setIsEditing(false)
      // Update the parent state
      setShippingAddress(shipping)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <div className="text-foreground w-[40%] ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shipping</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit shipping address"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
              title="Cancel editing"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        Object.values(shippingAddress || {}).every((v) => !v) ? (
          <p className="text-gray-500 italic">No shipping address yet.</p>
        ) : (
          <div>
            <p className="text-foreground">
              {shippingAddress?.name || 'N/A'}
            </p>
            <p className="text-foreground ">
              {shippingAddress?.completeAddress || 'N/A'}
            </p>
            <p className="text-foreground ">
              {shippingAddress?.city || 'N/A'}
            </p>
            <div className="pt-4">
              <label htmlFor="email" className="pt-4">
                Email Address:
              </label>
              <p className="text-blue-700 underline">
                {shippingAddress?.email || 'N/A'}
              </p>
            </div>
            <div className="pt-2">
              <label htmlFor="">Phone:</label>
              <p className="text-blue-700 underline">
                {shippingAddress?.phone || 'N/A'}
              </p>
            </div>
          </div>
        )
      ) : (
        // Edit Mode - Display editable form fields
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <Input
                value={shipping.name}
                onChange={(e) =>
                  setShipping({ ...shipping, name: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={shipping.email}
                onChange={(e) =>
                  setShipping({ ...shipping, email: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <Input
                value={shipping.phone}
                onChange={(e) =>
                  setShipping({ ...shipping, phone: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <Input
                value={shipping.country}
                onChange={(e) =>
                  setShipping({ ...shipping, country: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <Input
                value={shipping.city}
                onChange={(e) =>
                  setShipping({ ...shipping, city: e.target.value })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Complete Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Complete Address
            </label>
            <Input
              value={shipping.completeAddress}
              onChange={(e) =>
                setShipping({ ...shipping, completeAddress: e.target.value })
              }
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={updateOrderMutation.isPending}
            className="w-full"
          >
            {updateOrderMutation.isPending ? 
              <BeatLoader color="white" size={8} />
              :'Update Shipping'
          }
          </Button>
        </form>
      )}
    </div>
  )
}

export default ShippingAddress
