'use client'

import { Suspense } from 'react'
import ProductClient from './ProductClient'
export const dynamic = 'force-dynamic'

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ProductClient />
    </Suspense>
  )
}
