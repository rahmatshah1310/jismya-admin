'use client'

import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useDeleteSingleProduct } from '@/app/api/productApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function DeleteProductModal({ isOpen, onClose, productId }) {
  const deleteMutation = useDeleteSingleProduct()
  const isLoading = deleteMutation.isPending
  const handleDelete = () => {
    deleteMutation.mutate(productId, {
      onSuccess: (res) => {
        toast.success(res?.message || 'Product deleted successfully!')
        onClose()
      },
      onError: (error) => {
        console.error('Delete error:', error)
        toast.error(typeof error === 'string' && error)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <h2 className="text-xl font-bold text-red-600">Are you sure?</h2>
        <p className="mt-4 text-gray-700">This action cannot be undone.</p>

        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleDelete} variant="outline">
            {isLoading ? 'Deleting...' : '  🗑️ Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
