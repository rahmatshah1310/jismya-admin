'use client'

import Modal from 'react-modal'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import InputField from '@/components/ui/InputField'
import { useUpdateSale } from '@/app/api/saleApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function UpdateSaleModal({ sale, isOpen, onClose }) {
  const [form, setForm] = useState({
    saleName: '',
    description: '',
    discountPercentage: '',
  })

  const updateSaleMutation = useUpdateSale()

  useEffect(() => {
    if (sale) {
      setForm({
        saleName: sale.saleName || '',
        description: sale.description || '',
        discountPercentage: sale.discountPercentage || '',
      })
    }
  }, [sale])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.saleName.trim()) return toast.error('Sale name is required.')
    if (!form.discountPercentage) return toast.error('Discount is required.')

    try {
      const res = await updateSaleMutation.mutateAsync({
        id: sale._id,
        data: {
          ...form,
          discountPercentage: parseFloat(form.discountPercentage),
        },
      })

      toast.success(res?.message || 'Sale updated successfully!')
      onClose()
    } catch (error) {
      console.error('Update sale error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <div>
          <DialogTitle className="text-2xl font-semibold text-gray-800 mb-5 text-center">
            ✏️ Update Sale
          </DialogTitle>

          <div className="space-y-4">
            <Input
              label="Sale Name"
              name="saleName"
              value={form.saleName}
              onChange={handleChange}
              maxLength={200}
              className="w-full p-2 border rounded"
              placeholder="e.g. Summer Blast 2025"
            />
            <textarea
              id="description"
              name="description"
              rows={3}
              label="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-transparent"
              placeholder="Short summary of the sale"
            ></textarea>
            <InputField
              label="Discount Percentage"
              name="discountPercentage"
              type="number"
              value={form.discountPercentage}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-transparent"
              placeholder="e.g. 20"
              // min="0"
              // max="100"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateSaleMutation.isPending}
              variant="outline"
            >
              {updateSaleMutation.isPending ? 'Updating...' : 'Update Sale'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
