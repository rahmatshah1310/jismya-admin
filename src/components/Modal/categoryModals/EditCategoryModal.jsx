'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useUpdateCategory } from '@/app/api/productApi'

export default function EditCategoryModal({ isOpen, onClose, category }) {
  const [name, setName] = useState('')

  const updateCategoryMutation = useUpdateCategory()

  useEffect(() => {
    if (category) {
      setName(category.name || '')
    }
  }, [category])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await updateCategoryMutation.mutateAsync({
        id: category._id,
        data: { name },
      })
      toast.success(res?.message || 'Category updated successfully')
      onClose()
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Update Category</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2 bg-background"
            />
            
          </div> */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-700 text-white">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
