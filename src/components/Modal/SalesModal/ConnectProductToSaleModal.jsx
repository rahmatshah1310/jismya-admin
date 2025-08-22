'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

import { useGetAllSales, useConnectProductsToSale } from '@/app/api/saleApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function ConnectProductToSaleModal({
  productId,
  isOpen,
  onClose,
}) {
  const [selectedSaleId, setSelectedSaleId] = useState('')

  const { data: salesData, isLoading: salesLoading, isError } = useGetAllSales()
  const connectMutation = useConnectProductsToSale()

  const handleSubmit = async () => {
    if (!selectedSaleId) {
      toast.error('Please select a sale first.')
      return
    }

    try {
      const res = await connectMutation.mutateAsync({
        saleId: selectedSaleId,
        productIds: [productId],
      })

      toast.success(res?.message || 'Product added to sale!')
      setSelectedSaleId('')
      onClose()
    } catch (error) {
      console.error('Attach error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="text-xl font-bold mb-4">
          Attach Product to Sale
        </DialogTitle>

        {salesLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load sales list.</p>
        ) : (
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedSaleId}
            onChange={(e) => setSelectedSaleId(e.target.value)}
          >
            <option value="">Select a sale</option>
            {salesData?.data?.map((sale) => (
              <option key={sale._id} value={sale._id}>
                {sale.saleName}
              </option>
            ))}
          </select>
        )}

        <div className="mt-6 flex gap-4 overflow-auto">
          <Button onClick={onClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={connectMutation.isPending || !selectedSaleId}
          >
            {connectMutation.isPending ? 'Attaching...' : 'Attach'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
