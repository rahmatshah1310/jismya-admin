'use client'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useDeleteOrder } from '@/app/api/orderApi'

export default function DeleteOrderModal({
  order,
  onClose,
  showDeleteModal,
}) {
  if (!order) return null

  const deleteMutation = useDeleteOrder(order.orderId)
  const isLoading = deleteMutation.isPending

  const handleDelete = () => {
    deleteMutation.mutateAsync(order.orderId, {
      onSuccess: (res) => {
        toast.success(res?.message || 'Order deleted successfully!')
        onClose()
      },
      onError: (error) => {
        console.error('Delete error:', error)
        toast.error(typeof error === 'string' ? error : 'Something went wrong.')
      },
    })
  }

  return (
    <Dialog open={showDeleteModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <div className="p-6 space-y-5 text-center">
          <h2 className="text-2xl font-bold text-red-600">⚠ Are you sure?</h2>
          <p className="text-gray-600 text-base">
            Do you really want to delete the Order{' '}
            <strong>{order.heading}</strong>? <br />
            <span className="text-red-500 font-medium">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
