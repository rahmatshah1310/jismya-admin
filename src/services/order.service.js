import { sendRequest } from '@/services/sendingRequests'

// POST /orders
export const createOrder = async (data) => {
  const response = await sendRequest({
    method: 'POST',
    url: '/orders',
    data,
  })
  return response.data
}

// GET /orders
export const getAllOrders = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value != null)
  )

  const query = []
  if (cleanParams.page) query.push(`page=${cleanParams.page}`)
  if (cleanParams.status) query.push(`status=${cleanParams.status}`)
  if (cleanParams.email) query.push(`email=${cleanParams.email}`)
  if (cleanParams.phone) query.push(`phone=${cleanParams.phone}`)
  if (cleanParams.startDate) query.push(`startDate=${cleanParams.startDate}`)
  if (cleanParams.endDate) query.push(`endDate=${cleanParams.endDate}`)
  if (cleanParams.limit) query.push(`limit=${cleanParams.limit}`)

  const url = query.length ? `/orders?${query.join('&')}` : '/orders'

  const response = await sendRequest({ method: 'GET', url })
  return response.data
}

export const getOrderStats = async () => {
  const response = await sendRequest({
    method: 'GET',
    url: '/orders/stats',
  })
  return response.data
}
// GET /orders/:id
export const getSingleOrder = async (orderId) => {
  const response = await sendRequest({
    method: 'GET',
    url: `/orders/${orderId}`,
  })
  return response.data
}

// PUT /orders/:id
export const updateOrder = async (id, data) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/orders/${id}`,
    data,
  })
  return response.data
}

// DELETE /orders/:id
export const deleteOrder = async (id) => {
  const response = await sendRequest({
    method: 'DELETE',
    url: `/orders/${id}`,
  })
  return response.data
}

// PUT /orders/:id/status (optional: only update status)
export const updateOrderStatus = async (id, status) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/orders/status/${id}`,
    data: { status },
  })
  return response.data
}

export const cancelOrderStatus = async (id, status) => {
  const response = await sendRequest({
    method: 'PUT',
    url: `/orders/cancel/${id}`,
    data: { status },
  })
  return response.data
}

export const orderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  cancelOrderStatus,
  getOrderStats,
}
