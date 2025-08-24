'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useCreateProduct, useGetAllCategories } from '@/app/api/productApi'
import MultiSelect from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function ProductForm({ isOpen, onClose }) {
  const { data: categories } = useGetAllCategories()
  const [formData, setFormData] = useState({
    categoryId: '',
    productName: '',
    description: '',
    price: '',
    sales: 1,
    saleName: '',
    colorsAvailable: [],
    sizesAvailable: [],
    fabrics: '',
    imageUrl: '',
    imageFile: null,
  })
  const createProduct = useCreateProduct()
  const isSubmitting = createProduct.isPending

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.imageFile) {
      toast.error('Image is required.')
      return
    }

    const formPayload = new FormData()
    formPayload.append('productName', formData.productName)
    formPayload.append('category', formData.categoryId)
    formPayload.append('description', formData.description)
    formPayload.append('price', formData.price)
    formPayload.append('sales', formData.sales || 1)
    formPayload.append('fabrics', formData.fabrics)
    formPayload.append('image', formData.imageFile)

    // Append each color and size individually
    formData.colorsAvailable.forEach((color) =>
      formPayload.append('colorsAvailable[]', color)
    )
    formData.sizesAvailable.forEach((size) =>
      formPayload.append('sizesAvailable[]', size)
    )

    try {
      const res = await createProduct.mutateAsync(formPayload)
      toast.success(res?.message || 'Product created successfully!')
      onClose?.()
    } catch (error) {
      console.error('Product creation failed:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  // if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="h-auto p-2 space-y-6 ">
          <DialogTitle className="text-3xl font-bold text-blue-700 mb-4 border-b pb-2">
            🛍️ Create Product
          </DialogTitle>
          {/* Product Name */}
          <Input
            maxLength={200}
            id="productName"
            name="productName"
            value={formData.productName ?? ''}
            onChange={handleChange}
            className="border p-2 w-full"
            label="Product Name"
          />
          {/* Category */}
          <div>
            <label htmlFor="categoryName" className="block font-semibold mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="border rounded p-3 w-full bg-background"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories?.data?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Price, Discount, Sales */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 w-full"
              label="Price"
            />

            {/* Fabrics */}
            <Input
              id="fabrics"
              name="fabrics"
              value={formData.fabrics}
              onChange={handleChange}
              className="border p-2 w-full"
              label="fabrics"
            />
          </div>
          {/*Colors */}
          <div>
            <MultiSelect
              label="Colors"
              name="colorsAvailable"
              value={formData.colorsAvailable}
              options={['Red', 'Blue', 'Black']}
              onChange={(name, selected) =>
                setFormData((prev) => ({ ...prev, [name]: selected }))
              }
            />
          </div>

          {/* Sizes */}
          <div>
            <MultiSelect
              label="Sizes"
              name="sizesAvailable"
              value={formData.sizesAvailable}
              options={['S', 'M', 'L', 'XL']}
              onChange={(name, selected) =>
                setFormData((prev) => ({ ...prev, [name]: selected }))
              }
            />
          </div>

          {/* Image Display + URL */}
          <div>
            <label className="block font-semibold  mb-1">Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="border p-2 w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full"
            variant="outline"
          >
            {isSubmitting ? 'Creating...' : '💾 Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
