'use client'

import { useState } from 'react'
import { FiEdit, FiTrash2, FiTag } from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import UpdateProductModal from './Modal/ProductModals/UpdateProductModal'
import DeleteProductModal from './Modal/ProductModals/DeleteProductModal'
import ProductOrderModal from './Modal/ProductModals/ProductOrderModal'

export default function ProductCard({ product, onCardClick, onAddToSale }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)

  return (
    <>
      <div
        className="bg-card border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer m-2"
        onClick={() => onCardClick(product._id)}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="h-14 w-14 rounded-lg object-cover border"
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {product.productName}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToSale(product)
              }}
              className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
              title="Add to Sale"
            >
              <FiTag size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowUpdateModal(true)
              }}
              className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
              title="Edit"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteModal(true)
              }}
              className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-2 text-sm">
          {/* Price & Discount */}
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="line-through text-muted-foreground text-xs">
                  Rs.{product.price.toFixed(2)}
                </span>
                <span className="text-green-600 font-semibold">
                  Rs.
                  {(
                    product.price -
                    (product.price * product.discount) / 100
                  ).toFixed(2)}
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {product.discount}% OFF
                </Badge>
              </>
            ) : (
              <span className="text-primary font-medium">
                Rs.{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Fabrics */}
          <div>
            <Badge variant="secondary" className="text-xs">
              {product.fabrics}
            </Badge>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap gap-1">
            {product.colorsAvailable.map((color, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {color}
              </Badge>
            ))}
          </div>

          {/* Sizes */}
          <div className="flex flex-wrap gap-1">
            {product.sizesAvailable.map((size) => (
              <Badge key={size} variant="outline" className="text-xs">
                {size}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateProductModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          product={product}
        />
      )}
      {showDeleteModal && (
        <DeleteProductModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          productId={product._id}
        />
      )}
      {showOrderModal && (
        <ProductOrderModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          product={product}
        />
      )}
    </>
  )
}
