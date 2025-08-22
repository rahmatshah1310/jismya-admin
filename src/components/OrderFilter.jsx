'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

export default function OrderFilters({ onFilter, currentFilters = {} }) {
  const [filters, setFilters] = useState({
    status: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    limit: '',
  })

  // Sync local state with current filters from URL
  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSearch = () => {
    onFilter(filters) // send filters to parent
  }

  const handleClear = () => {
    const clearedFilters = {
      status: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
      limit: '',
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-end border p-4 rounded-lg bg-background shadow-sm">
      {/* Status */}
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-40 bg-background"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input
          type="email"
          value={filters.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="customer@example.com"
          className="w-56"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm mb-1">Phone</label>
        <Input
          type="text"
          value={filters.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="03123456789"
          className="w-40"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm mb-1">Start Date</label>
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm mb-1">End Date</label>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>

      {/* Limit */}
      <div>
        <label className="block text-sm mb-1">Limit</label>
        <Input
          type="number"
          value={filters.limit}
          onChange={(e) => handleChange('limit', e.target.value)}
          placeholder="20"
          className="w-20"
          min="1"
          max="100"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="mt-1">
          Search
        </Button>
        {hasActiveFilters && (
          <Button onClick={handleClear} variant="outline" className="mt-1">
            <X className="w-4 h-4 mr-1" />
            Clear Search
          </Button>
        )}
      </div>
    </div>
  )
}
