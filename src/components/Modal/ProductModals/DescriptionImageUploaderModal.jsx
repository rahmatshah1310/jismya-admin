'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { useAddDescriptionImages } from '@/app/api/productApi'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function DescriptionImageUploaderModal({
  productId,
  isOpen,
  onClose,
}) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const { mutateAsync: addImages, isPending } = useAddDescriptionImages()

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileSelect(droppedFiles)
  }

  const handleFileSelect = (selected) => {
    const filesArray = Array.from(selected)
    setFiles((prev) => [...prev, ...filesArray])

    filesArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async () => {
    if (!files.length) return toast.error('No files selected')

    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    formData.append('productId', productId)

    try {
      const res = await addImages(formData)
      toast.success(res?.message || 'Images uploaded successfully!')
      setFiles([])
      setPreviews([])
      onClose()
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <div className="p-2 space-y-6 ">
          <DialogTitle className="text-3xl font-bold mb-4 border-b pb-2">
            🖼️ Upload Description Images
          </DialogTitle>

          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:border-blue-500 transition-all"
          >
            <FaUpload className="w-10 h-10  mb-2 text-background" />
            <p className="text-background">Click or drag & drop images here</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {previews.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mt-4 mb-2">
                Selected Images:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {previews.map((src, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden border shadow hover:shadow-md transition"
                  >
                    <Image
                      src={src}
                      alt={`preview-${index}`}
                      width={200}
                      height={150}
                      className="object-cover w-full h-32"
                    />
                    <Button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTimes size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            disabled={isPending || files.length === 0}
            onClick={handleUpload}
            className="w-full"
            type="submit"
            variant="outline"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="w-5 h-5" />
                Upload Images
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
