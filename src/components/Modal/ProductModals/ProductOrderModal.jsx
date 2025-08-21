'use client'
import { useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useUpdateProductOrder } from '@/app/api/productApi'
import InputField from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export default function ProductOrderModal({ product, onClose, isOpen }) {
  if (!product) return null
  const [order, setOrder] = useState(product?.order)
  const reOrder = useUpdateProductOrder()
  const isLoading = reOrder.isPending

  const handleSubmit = (e) => {
    e.preventDefault()
    reOrder.mutate(
      {
        id: product._id,
        data: { order: Number(order) },
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message)
          onClose()
        },
        onError: (error) => {
          console.error('Reorder error:', error)
          toast.error(
            typeof error === 'string' ? error : 'Something went wrong.'
          )
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <DialogTitle className="text-2xl font-bold">
            Reorder product
          </DialogTitle>
          <InputField
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border p-2 w-full"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onClose} type="button" vriant="outline">
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
