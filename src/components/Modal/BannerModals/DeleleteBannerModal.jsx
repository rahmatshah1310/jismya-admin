'use client'
import { useDeleteBannerMutation } from '@/app/api/bannerApi'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function DeleteBannerModal({
  banner,
  onClose,
  showDeleteModal,
}) {
  if (!banner) return null

  const deleteMutation = useDeleteBannerMutation()
  const isLoading = deleteMutation.isPending

  const handleDelete = () => {
    deleteMutation.mutate(banner._id, {
      onSuccess: (res) => {
        toast.success(res?.message || 'Banner deleted successfully!')
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
            Do you really want to delete the banner{' '}
            <strong>{banner.heading}</strong>? <br />
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
