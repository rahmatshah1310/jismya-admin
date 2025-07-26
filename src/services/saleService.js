import { sendRequest } from "@/services/sendingRequests";
// GET /products/sales/:id
export const getProductSales = async (id) => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/sales/${id}`,
  });
  return response.data;
};

// GET /products/sales
export const getAllSales = async () => {
  const response = await sendRequest({
    method: "GET",
    url: `/sales/all`,
  });
  return response.data;
};

// POST /products/sale
export const createSale = async (data) => {
  const response = await sendRequest({
    method: "POST",
    url: `/sales`,
    data,
  });
  return response.data;
};

// POST /products/sale/add
export const addProductsToSale = async ({ saleId, productIds }) => {
  const response = await sendRequest({
    method: "POST",
    url: `/sales/${saleId}/products`, 
    data: { productIds },            
  });
  return response.data;
};



// DELETE /products/sale/remove
export const removeProductsFromSale = async (data) => {
  const response = await sendRequest({
    method: "DELETE",
    url: "/products/sale/remove",
    data,
  });
  return response.data;
};

// PATCH /products/sale/status/:id
export const updateSaleStatus = async (id, data) => {
  const response = await sendRequest({
    method: "PATCH",
    url: `/products/sale/status/${id}`,
    data,
  });
  return response.data;
};

// PATCH /api/sales/:id
export const updateSale = async (id, data) => {
  const response = await sendRequest({
    method: "PUT",
    url: `/sales/${id}`,
    data,
  });
  return response.data;
};


// DELETE /products/sale/:id
export const deleteSale = async (id) => {
  const response = await sendRequest({
    method: "DELETE",
    url: `/sales/${id}`,
  });
  return response.data;
};

// GET /products/sale/stats
export const getSalesStats = async () => {
  const response = await sendRequest({
    method: "GET",
    url: `/products/sale/stats`,
  });
  return response.data;
};



export const saleService = {
  getProductSales,
  getAllSales,
  createSale,
  addProductsToSale,
  removeProductsFromSale,
  updateSaleStatus,
  updateSale,
  deleteSale,
  getSalesStats,
};