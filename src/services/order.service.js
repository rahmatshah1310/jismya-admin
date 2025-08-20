import axios from "axios";

// POST /orders
export const createOrder = async (data) => {
  const response = await axios.post("http://localhost:3001/api/v1/orders", data, {
    withCredentials: true,
  });
  return response.data.data;
};

// GET /orders
export const getAllOrders = async () => {
  const response = await axios.get("http://localhost:3001/api/v1/orders", {
    withCredentials: true,
  });
  return response.data.data;
};

// GET /orders/:id
export const getSingleOrder = async (id) => {
  const response = await axios.get(`http://localhost:3001/api/v1/orders/${id}`, {
    withCredentials: true,
  });
  return response.data.data;
};

// PUT /orders/:id
export const updateOrder = async (id, data) => {
  const response = await axios.put(`http://localhost:3001/api/v1/orders/${id}`, data, {
    withCredentials: true,
  });
  return response.data.data;
};

// DELETE /orders/:id
export const deleteOrder = async (id) => {
  const response = await axios.delete(`http://localhost:3001/api/v1/orders/${id}`, {
    withCredentials: true,
  });
  return response.data.data;
};

// Optional: Update only status
export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`http://localhost:3001/api/v1/orders/${id}/status`, { status }, { withCredentials: true });
  return response.data.data;
};

export const orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
};
