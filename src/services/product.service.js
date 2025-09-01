import { sendRequest } from '@/services/sendingRequests'

// POST /products
export const createProduct = async (data) => {
  const response = await sendRequest({
    method: 'POST',
    url: '/products',
    data,
  })
  return response.data
}

// PUT /products/:id
export const updateProduct = async (id, data) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/products/${id}`,
    data,
  })
  return response.data
}

// GET /products/:id
export const getSingleProduct = async (id) => {
  const response = await sendRequest({
    method: 'GET',
    url: `/products/${id}`,
  })
  return response.data
}

export const deleteSingleProduct = async (id) => {
  const response = await sendRequest({
    method: 'DELETE',
    url: `/products/${id}`,
  })
  return response.data
}

// GET /categories
export const getAllCategories = async () => {
  const response = await sendRequest({
    method: 'GET',
    url: '/categories',
  })
  return response.data
}

export const createCategory = async (data) => {
  const response = await sendRequest({
    method: 'POST',
    url: '/categories',
    data,
  })
  return response.data
}

export const updateCategory = async (id, data) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/categories/${id}`,
    data,
  })
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await sendRequest({
    method: 'DELETE',
    url: `/categories/${id}`,
  })
  return response.data
}

// GET /products
export const getAllProducts = async () => {
  const response = await sendRequest({
    method: 'GET',
    url: '/products/all',
  })
  return response.data
}

// GET /products/sizes
export const getSizes = async () => {
  const response = await sendRequest({
    method: 'GET',
    url: '/products/sizes',
  })
  return response.data
}

// GET /products/size/:size
export const getProductsBySize = async (size) => {
  const response = await sendRequest({
    method: 'GET',
    url: `/products/size/${size}`,
  })
  return response.data
}

// GET /products/category/:categoryName
export const getProductsByCategory = async (categoryName) => {
  const response = await sendRequest({
    method: 'GET',
    url: `/category/${categoryName}`,
  })
  return response.data
}

// POST /products/:productId/description
export const addDescriptionImages = async (data) => {
  const productId = data.get('productId')

  const response = await sendRequest({
    method: 'POST',
    url: `/products/description/${productId}`,
    data,
  })

  return response.data
}

// DELETE /products/images/:id
export const deleteDescriptionImage = async (id) => {
  const response = await sendRequest({
    method: 'DELETE',
    url: `/products/${id}/description/${id}`,
  })
  return response.data
}

// PUT /products/order/:id
export const updateProductOrder = async (id, data) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/products/order/${id}`,
    data,
  })
  return response.data
}

// GET /products/reviews/:id
export const getProductReviews = async (id) => {
  const response = await sendRequest({
    method: 'GET',
    url: `/products/${id}/reviews`,
  })
  return response.data
}

// POST /products/review
export const createProductReview = async (data) => {
  const response = await sendRequest({
    method: 'POST',
    url: `/products/review`,
    data,
  })
  return response.data
}

export const getProductSalestats = async () => {
  const response = await sendRequest({
    method: 'GET',
    url: '/products/stats/overview',
  })
  return response.data
}

export const searchProducts = async (searchTerm) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/search?item=${encodeURIComponent(searchTerm)}`,
  });
  return response.data;
};

export const productService = {
  createProduct,
  updateProduct,
  getSingleProduct,
  deleteSingleProduct,
  getAllCategories,
  getAllProducts,
  updateCategory,
  deleteCategory,
  getSizes,
  searchProducts,
  createCategory,
  getProductsBySize,
  getProductsByCategory,
  addDescriptionImages,
  deleteDescriptionImage,
  updateProductOrder,
  getProductReviews,
  createProductReview,
  getProductSalestats,
}
