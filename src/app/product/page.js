'use client'

import { Suspense } from 'react'
import { ClipLoader } from 'react-spinners'
import ProductClient from './ProductClient'

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div>
          <ClipLoader />
        </div>
      }
    >
      <ProductClient />
    </Suspense>
  )
}
