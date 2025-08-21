'use client'
import { useReorderBannerMutation } from '@/app/api/bannerApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function ReorderBannerModal({
  banner,
  onClose,
  showReorderModal,
}) {
  if (!banner) return null
  const [order, setOrder] = useState(banner?.order)
  const reOrder = useReorderBannerMutation()
  const isLoading = reOrder.isPending

  const handleSubmit = (e) => {
    e.preventDefault()
    reOrder.mutate(
      { id: banner._id, data: { order: Number(order) } },
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
    <Dialog open={showReorderModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <DialogTitle className="text-2xl font-bold text-purple-600">
            🔢 Reorder Banner
          </DialogTitle>
          <Input
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border p-2 rounded-lg w-full"
          />
          <div className="flex gap-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
