'use client'
import { useUpdateBannerMutation } from '@/app/api/bannerApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import InputField from '@/components/ui/InputField'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

export default function EditBannerModal({ onClose, showEditModal, banner }) {
  const updateBanner = useUpdateBannerMutation()
  const [form, setForm] = useState({
    heading: banner?.heading || '',
    description: banner?.description || '',
    image: null,
    deviceType: banner?.deviceType || 'laptop',
  })

  const isSubmitting = updateBanner.isPending

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
    formData.append('deviceType', form.deviceType)
    if (form.image) formData.append('image', form.image)

    try {
      const res = await updateBanner.mutateAsync({
        id: banner._id,
        data: formData,
      })
      toast.success(res?.message)
      onClose()
    } catch (error) {
      console.error('Update banner error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={showEditModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogTitle className="font-bold text-2xl text-blue-600">
            ✏️ Edit Banner
          </DialogTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Banner Heading"
              value={form.heading ?? ''}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              placeholder="Heading"
              maxLength={200}
              className="border p-2 rounded-lg"
            />

            <Input
              type="file"
              label="Upload Image"
              accept="image/*"
              onChange={handleImageSelect}
              className="cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="">Description</label>
            <textarea
              id="description"
              rows={3}
              className="w-full rounded-lg border border-gray-800 p-2 bg-transparent"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            ></textarea>
          </div>

          <div className="flex gap-x-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
