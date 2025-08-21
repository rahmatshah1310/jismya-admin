/* ProductFilters.tsx */
'use client'

import { useGetAllCategories, useGetSizes } from '@/app/api/productApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProductFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [size, setSize] = useState(searchParams.get('size') || '')

  const { data: categories } = useGetAllCategories()
  const { data: sizes } = useGetSizes()
  const categoriesall = categories?.data
  const sizesall = sizes?.data

  useEffect(() => {
    const query = new URLSearchParams()
    if (category) query.set('category', category)
    if (size) query.set('size', size)
    router.push(`/product?${query.toString()}`)
  }, [category, size])

  return (
    <div className="flex items-center gap-4 w-full">
      {/* Category Filter */}
      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-800 rounded p-3 flex-1 bg-transparent"
      >
        <option value="" className="text-gray-800">
          All Categories
        </option>
        {categoriesall?.map((cat) => (
          <option
            key={cat._id ?? cat.name} // ensure unique key
            value={cat.name} // send name string to query
            className="text-foreground bg-background"
          >
            {cat.name}
          </option>
        ))}
      </select>

      {/* Size Filter */}
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="border border-gray-800 rounded p-3 flex-1 bg-transparent"
      >
        <option value="" className="text-gray-800">
          All Sizes
        </option>
        {sizesall?.map((sz) => (
          <option
            key={sz._id ?? sz} // unique primitive key
            value={sz.name ?? sz} // pick the right string
            className="text-foreground bg-background"
          >
            {sz.name ?? sz}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProductFilters
