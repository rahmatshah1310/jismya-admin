'use client'
import { useSingleBanner } from '@/app/api/bannerApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'

export default function ViewOrderModal({ bannerId, onClose, showViewModal }) {
  const { data, isLoading, error } = useSingleBanner(bannerId)
  const banner = data.data

  return (
    <Dialog open={showViewModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {isLoading ? (
          <p className="p-4 flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </p>
        ) : error ? (
          <p className="p-4 text-red-500">Failed to load banner</p>
        ) : (
          <div className="flex flex-col w-full h-full overflow-auto p-4 space-y-4 bg-background">
            <h2 className="text-3xl font-bold text-center break-words overflow-auto">
              {banner?.heading}
            </h2>
            <Image
              src={banner?.imageUrl}
              width={300}
              height={300}
              alt="banner"
              className="w-full h-64 object-cover rounded"
            />
            <div className="flex-1 space-y-2 text-lg break-words overflow-auto">
              <p>
                <strong>Description:</strong> {banner?.description}
              </p>
              <p>
                <strong>Device Type:</strong> {banner?.deviceType}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {banner?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <Button onClick={onClose} type="button" variant="outline">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
