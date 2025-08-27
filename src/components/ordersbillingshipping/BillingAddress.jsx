import React, { useState } from 'react'
import { Edit, Pencil, Save, X, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { useUpdateBillingAddress } from '@/app/api/orderApi'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'

const BillingAddress = ({ order, billingAddress, setBillingAddress, onCopyToShipping }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [billing, setBilling] = useState({
    name: billingAddress?.name || '',
    email: billingAddress?.email || '',
    phone: billingAddress?.phone || '',
    country: billingAddress?.country || '',
    city: billingAddress?.city || '',
    completeAddress: billingAddress?.completeAddress || '',
  })

  const updateOrderMutation = useUpdateBillingAddress()

  const handleEdit = () => {
    setIsEditing(true)
    // Reset form to current values
    setBilling({
      name: billingAddress?.name || '',
      email: billingAddress?.email || '',
      phone: billingAddress?.phone || '',
      country: billingAddress?.country || '',
      city: billingAddress?.city || '',
      completeAddress: billingAddress?.completeAddress || '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
    setBilling({
      name: billingAddress?.name || '',
      email: billingAddress?.email || '',
      phone: billingAddress?.phone || '',
      country: billingAddress?.country || '',
      city: billingAddress?.city || '',
      completeAddress: billingAddress?.completeAddress || '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateOrderMutation.mutateAsync({
        orderId: order.orderId,
        billingAddress: billing,
      })
      toast.success(res?.message || 'Billing address updated successfully!')
      setIsEditing(false)
      // Update the parent state
      setBillingAddress(billing)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <div className="text-foreground w-[40%] shadow-sm mb-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Billing</h2>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyToShipping}
              className="flex items-center gap-1 text-xs"
              title="Copy to Shipping"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit billing address"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
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
        // View Mode - Display data as read-only
        <div>
          <p className="text-foreground">
            {billingAddress?.name || 'N/A'}
          </p>
          <p className="text-foreground ">
            {billingAddress?.completeAddress || 'N/A'}
          </p>
          <p className="text-foreground ">
            {billingAddress?.city || 'N/A'}
          </p>
          <div className="pt-4">
            <label htmlFor="email" className="pt-4 font-bold text-gray-500">
              Email Address:
            </label>
            <p className="text-blue-700 underline">
              {billingAddress?.email || 'N/A'}
            </p>
          </div>
          <div className="pt-2">
            <label htmlFor="" className="font-bold text-gray-500 ">
              Phone:
            </label>
            <p className="text-blue-700 underline">
              {billingAddress?.phone || 'N/A'}
            </p>
          </div>
        </div>
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
                value={billing.name}
                onChange={(e) =>
                  setBilling({ ...billing, name: e.target.value })
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
                value={billing.email}
                onChange={(e) =>
                  setBilling({ ...billing, email: e.target.value })
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
                value={billing.phone}
                onChange={(e) =>
                  setBilling({ ...billing, phone: e.target.value })
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
                value={billing.country}
                onChange={(e) =>
                  setBilling({ ...billing, country: e.target.value })
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
                value={billing.city}
                onChange={(e) =>
                  setBilling({ ...billing, city: e.target.value })
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
              value={billing.completeAddress}
              onChange={(e) =>
                setBilling({ ...billing, completeAddress: e.target.value })
              }
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={updateOrderMutation.isPending}
            className="w-full"
          >
            {updateOrderMutation.isPending ? (
              <BeatLoader color="white" size={8} />
            ) : (
              'Update Billing'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export default BillingAddress