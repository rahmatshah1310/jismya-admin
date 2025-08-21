'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCreateCategory } from '@/app/api/productApi'

export default function AddCategoryModal({
  isOpen,
  onClose,
  initialData,
}) {
  const [name, setName] = useState('')

  useEffect(() => {
    setName(initialData?.name || '')
  }, [initialData])
  
  const createCategoryMutation = useCreateCategory()
const isLoading=createCategoryMutation.isPending


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res=await createCategoryMutation.mutateAsync({ name, })
      toast.success(res?.message || 'Category created successfully')
      setName('')
      onClose()
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Add Category</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>

          {/* Description */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter category description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='border border-gray-300 rounded-md p-2 w-full bg-background'
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div> */}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-700 text-white">
             {isLoading?" Save Category...":" Save Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
