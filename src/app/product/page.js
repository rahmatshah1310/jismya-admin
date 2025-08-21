'use client'

import { Suspense } from 'react'
import Product from './Product'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ClipLoader } from 'react-spinners'

export default function ProductPage() {
  return (
    <DashboardLayout>
      {' '}
      <Suspense
        fallback={
          <div>
            <ClipLoader />
          </div>
        }
      >
        <Product />
      </Suspense>
    </DashboardLayout>
  )
}
