'use client'

import { Suspense } from 'react'
import { ClipLoader } from 'react-spinners'
import ProductClient from './ProductClient'
export const dynamic = 'force-dynamic'

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div>
          <ClipLoader color="#fff" />
        </div>
      }
    >
      <ProductClient />
    </Suspense>
  )
}
