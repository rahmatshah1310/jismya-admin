'use client'

import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useGetAllCategories, useUpdateProduct } from '@/app/api/productApi'
import MultiSelect from '@/components/ui/MultiSelect'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function UpdateProductModal({ isOpen, onClose, product }) {
  const { data: categories } = useGetAllCategories()
  const [formData, setFormData] = useState({ ...product, imageFile: null })
  const updateProduct = useUpdateProduct()
  const isSubmitting = updateProduct.isPending

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        categoryId: product.category?._id || '',
        imageFile: null,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      categoryId: product.category?._id || '',
      imageFile: file,
      imageUrl,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formPayload = new FormData()
    formPayload.append('productName', formData.productName)
    formPayload.append('category', formData.categoryId)
    formPayload.append('description', formData.description)
    formPayload.append('price', formData.price)
    formPayload.append('sales', formData.sales)
    formPayload.append('fabrics', formData.fabrics)
    if (formData.imageFile) {
      formPayload.append('image', formData.imageFile)
    }
    formData.colorsAvailable.forEach((color) =>
      formPayload.append('colorsAvailable[]', color)
    )
    formData.sizesAvailable.forEach((size) =>
      formPayload.append('sizesAvailable[]', size)
    )

    try {
      const res = await updateProduct.mutateAsync({
        id: product._id,
        data: formPayload,
      })
      toast.success(res?.message || 'Product updated successfully!')
      onClose?.()
    } catch (error) {
      console.error('Update product error:', error)
      toast.error(typeof error === 'string' ? error : 'Something went wrong.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="h-auto p-2 space-y-6 ">
          <DialogTitle className="text-3xl font-bold  mb-4 border-b pb-2">
            ✏️ Update Product
          </DialogTitle>

          {/* Same fields as in ProductForm */}
          {/* Example: */}
          <Input
            maxLength={200}
            name="productName"
            value={formData.productName ?? ''}
            onChange={handleChange}
            className="border p-2 w-full"
            label="Product Name"
          />
          <div>
            <label htmlFor="category" className="block font-semibold mb-1">
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
          <div>
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-transparent "
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 w-full"
              label="Price"
            />

            <Input
              name="sales"
              type="number"
              value={formData.sales}
              onChange={handleChange}
              className="border p-2 w-full"
              label="Sales"
            />
            <Input
              name="fabrics"
              value={formData.fabrics}
              onChange={handleChange}
              className="border p-2 w-full"
              label="Fabrics"
            />
          </div>

          <MultiSelect
            name="colorsAvailable"
            label="Colors"
            value={formData.colorsAvailable}
            options={['Red', 'Blue', 'Black']}
            onChange={(name, selected) =>
              setFormData((prev) => ({ ...prev, [name]: selected }))
            }
          />
          <MultiSelect
            name="sizesAvailable"
            label="Sizes"
            value={formData.sizesAvailable}
            options={['S', 'M', 'L', 'XL']}
            onChange={(name, selected) =>
              setFormData((prev) => ({ ...prev, [name]: selected }))
            }
          />

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="border p-2 w-full"
          />

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-lg"
          >
            {isSubmitting ? 'Updating...' : '✅ Update Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
