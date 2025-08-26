import React, { useState } from 'react'
import { Edit, Pencil, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUpdateShippingAddress } from '@/app/api/orderApi'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'

const ShippingAddress = ({ order, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [shipping, setShipping] = useState({
    name: order.shippingAddress?.name || '',
    email: order.shippingAddress?.email || '',
    phone: order.shippingAddress?.phone || '',
    country: order.shippingAddress?.country || '',
    city: order.shippingAddress?.city || '',
    completeAddress: order.shippingAddress?.completeAddress || '',
  })

  const updateOrderMutation = useUpdateShippingAddress()

  const handleEdit = () => {
    setIsEditing(true)
    // Reset form to current values
    setShipping({
      name: order.shippingAddress?.name || '',
      email: order.shippingAddress?.email || '',
      phone: order.shippingAddress?.phone || '',
      country: order.shippingAddress?.country || '',
      city: order.shippingAddress?.city || '',
      completeAddress: order.shippingAddress?.completeAddress || '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
    setShipping({
      name: order.shippingAddress?.name || '',
      email: order.shippingAddress?.email || '',
      phone: order.shippingAddress?.phone || '',
      country: order.shippingAddress?.country || '',
      city: order.shippingAddress?.city || '',
      completeAddress: order.shippingAddress?.completeAddress || '',
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
      // Optionally refresh the order data here
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
        Object.values(order.shippingAddress || {}).every((v) => !v) ? (
          <p className="text-gray-500 italic">No shipping address yet.</p>
        ) : (
          <div>
            <p className="text-foreground">
              {order.shippingAddress?.name || 'N/A'}
            </p>
            <p className="text-foreground ">
              {order.shippingAddress?.completeAddress || 'N/A'}
            </p>
            <p className="text-foreground ">
              {order.shippingAddress?.city || 'N/A'}
            </p>
            <div className="pt-4">
              <label htmlFor="email" className="pt-4">
                Email Address:
              </label>
              <p className="text-blue-700 underline">
                {order.shippingAddress?.email || 'N/A'}
              </p>
            </div>
            <div className="pt-2">
              <label htmlFor="">Phone:</label>
              <p className="text-blue-700 underline">
                {order.shippingAddress?.phone || 'N/A'}
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
          <div>
            {' '}
            <button
              onClick={handleSubmit}
              disabled={updateOrderMutation.isPending}
              className="p-2 rounded w-full bg-foreground text-background transition-colors"
            >
              {updateOrderMutation.isPending ? (
                <BeatLoader color="darkBlue" />
              ) : (
                '  Update Shipping'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ShippingAddress
