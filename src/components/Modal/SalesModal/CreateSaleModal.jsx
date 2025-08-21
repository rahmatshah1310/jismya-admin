'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import InputField from '@/components/ui/InputField'
import { useCreateSale } from '@/app/api/saleApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function CreateSaleModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    saleName: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
  })

  const createSale = useCreateSale()
  const isSubmitting = createSale.isPending

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('saleName', form.saleName)
      formData.append('description', form.description)
      formData.append(
        'discountPercentage',
        Number(form.discountPercentage).toString()
      )
      formData.append('startDate', form.startDate)
      formData.append('endDate', form.endDate)
      // ⬇️ capture response from mutateAsync
      const res = await createSale.mutateAsync(form)

      toast.success(res?.message || 'Sale created successfully!')

      setForm({
        saleName: '',
        description: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
      })

      onClose()
    } catch (error) {
      console.error('Sale creation error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogTitle className="text-3xl font-bold text-center mb-6 ">
          🎉 Create New Sale
        </DialogTitle>

        <form className="grid gap-4 space-y-3">
          <Input
            type="text"
            name="saleName"
            placeholder="Sale Name"
            value={form.saleName}
            maxLength={200}
            onChange={handleChange}
            className="p-2.5 border rounded bg-transparent"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-2.5 border rounded bg-transparent"
          />
          <InputField
            type="number"
            name="discountPercentage"
            placeholder="Discount %"
            value={form.discountPercentage}
            onChange={handleChange}
            className="p-2.5 border rounded bg-transparent"
          />
          <InputField
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="p-2.5 border rounded bg-transparent"
          />
          <InputField
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="p-2.5 border rounded bg-transparent"
          />
        </form>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-pink-500 text-pink-600 hover:bg-pink-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="brand"
            className={
              isSubmitting
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-gray-300 hover:opacity-90'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
            }
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
