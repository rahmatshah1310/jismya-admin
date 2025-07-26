import { sendRequest } from "@/services/sendingRequests";

// POST /products
export const createProduct = async (data) => {
  const response = await sendRequest({
    method: "POST",
    url: "/products",
    data,
  });
  return response.data;
};

// PUT /products/:id
export const updateProduct = async (id, data) => {
  const response = await sendRequest({
    method: "PUT",
    url: `/products/${id}`,
    data,
  });
  return response.data;
};

// GET /products/:id
export const getSingleProduct = async (id) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/${id}`,
  });
  return response.data;
};

export const deleteSingleProduct = async (id) => {
  const response = await sendRequest({
    method: "DELETE",
    url: `/products/${id}`,
  });
  return response.data;
};

// GET /categories
export const getAllCategories = async () => {
  const response = await sendRequest({
    method: "GET",
    url: "/products/categories",
  });
  return response.data;
};

// GET /products
export const getAllProducts = async () => {
  const response = await sendRequest({
    method: "GET",
    url: "/products/all",
  });
  return response.data;
};

// GET /products/sizes
export const getSizes = async () => {
  const response = await sendRequest({
    method: "GET",
    url: "/products/sizes",
  });
  return response.data;
};

// GET /products/size/:size
export const getProductsBySize = async (size) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/size/${size}`,
  });
  return response.data;
};

// GET /products/category/:categoryName
export const getProductsByCategory = async (categoryName) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/category/${categoryName}`,
  });
  return response.data;
};

// POST /products/:productId/description
export const addDescriptionImages = async (data) => {
  const productId = data.get("productId");

  const response = await sendRequest({
    method: "POST",
    url: `/products/${productId}/description`,
    data,
  });

  return response.data;
};


// DELETE /products/images/:id
export const deleteDescriptionImage = async (id) => {
  const response = await sendRequest({
    method: "DELETE",
    url: `/products/images/${id}`,
  });
  return response.data;
};

// PUT /products/order/:id
export const updateProductOrder = async (id, data) => {
  const response = await sendRequest({
    method: "PUT",
    url: `/products/order/${id}`,
    data,
  });
  return response.data;
};

// GET /products/reviews/:id
export const getProductReviews = async (id) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/reviews/${id}`,
  });
  return response.data;
};

// POST /products/review
export const createProductReview = async (data) => {
  const response = await sendRequest({
    method: "POST",
    url: `/products/review`,
    data,
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
  getSizes,
  getProductsBySize,
  getProductsByCategory,
  addDescriptionImages,
  deleteDescriptionImage,
  updateProductOrder,
  getProductReviews,
  createProductReview,
};
