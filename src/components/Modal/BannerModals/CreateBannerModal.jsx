'use client'

import { useState } from 'react'
import { useCreateBannerMutation } from '@/app/api/bannerApi'
import { toast } from 'react-toastify'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'

export default function CreateBannerModal({
  onClose,
  showCreateModal,
  deviceType,
}) {
  const createBanner = useCreateBannerMutation()
  const [form, setForm] = useState({
    heading: '',
    description: '',
    image: null,
    deviceType: deviceType || 'laptop',
  })
  const isSubmitting = createBanner.isPending

  const dimensionRules = {
    laptop: { width: 1280, height: 720 },
    tablet: { width: 900, height: 300 },
    mobile: { width: 500, height: 200 },
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const { width, height } = img
      const { width: reqWidth, height: reqHeight } =
        dimensionRules[form.deviceType]

      if (width !== reqWidth || height !== reqHeight) {
        toast.error(
          `Invalid image dimensions. Required: ${reqWidth}x${reqHeight}px. Yours: ${width}x${height}px`
        )
        e.target.value = null // clear input properly
        setForm((prev) => ({ ...prev, image: null })) // clear state too
        return
      }

      setForm((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.image) {
      toast.error('Image should not be empty')
      return
    }

    const formData = new FormData()
    formData.append('heading', form.heading)
    formData.append('description', form.description)
    formData.append('deviceType', deviceType)
    formData.append('image', form.image)

    try {
      const res = await createBanner.mutateAsync(formData)
      toast.success(res?.message || 'Banner created successfully!')
      onClose()
    } catch (error) {
      console.error('Banner creation error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={showCreateModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Banner</DialogTitle>
          <DialogDescription>
            Add a new banner for{' '}
            <span className="capitalize">{deviceType}</span> device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="heading"
            label="Banner Heading"
            name="heading"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
            placeholder="Banner heading"
            maxLength={200}
          />

          <div>
            <label htmlFor="">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="w-full rounded p-2 bg-transparent border"
            />
          </div>

          <Input
            type="file"
            label="Upload Image"
            accept="image/*"
            onChange={handleImageSelect}
            className="cursor-pointer"
          />

          <DialogFooter className="flex gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
