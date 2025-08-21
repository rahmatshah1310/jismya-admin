'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllCategories } from '../api/productApi'
import AddCategoryModal from '@/components/Modal/categoryModals/AddCategoryModal'
import EditCategoryModal from '@/components/Modal/categoryModals/EditCategoryModal'
import DeleteCategoryModal from '@/components/Modal/categoryModals/DeleteCategoryModal'
import { toast } from 'react-toastify'

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const { data, isLoading, refetch } = useGetAllCategories()

  // ✅ Extract categories safely
  const categories = data?.data || []

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    refetch()
    setIsEditModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteSuccess = () => {
    refetch()
    setIsDeleteModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                All Categories ({categories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No categories found.</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Create your first category to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex justify-between items-center p-4 border rounded-lg  transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(cat)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Category Modal */}
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            refetch()
            setIsAddModalOpen(false)
          }}
        />

        {/* Edit Category Modal */}
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedCategory(null)
          }}
          category={selectedCategory}
          onSuccess={handleEditSuccess}
        />

        {/* Delete Category Modal */}
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedCategory(null)
          }}
          category={selectedCategory}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </DashboardLayout>
  )
}
