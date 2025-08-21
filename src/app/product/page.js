'use client'

import { Suspense } from 'react'
import Product from './Product'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ProductPage() {
  return (
    <DashboardLayout>
      {' '}
      <Suspense fallback={<div>Loading products...</div>}>
        <Product />
      </Suspense>
    </DashboardLayout>
  )
}
