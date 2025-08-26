import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateOrderStatus({ orderId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// Bulk update order status
export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, status }) =>
      orderService.bulkUpdateOrderStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => orderService.cancelOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// 🔍 Queries

export const useGetAllOrders = (filters = {}) =>
  useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getAllOrders(filters),
    keepPreviousData: true,
  })

export const useGetOrderStats = () =>
  useQuery({
    queryKey: ['order-stats'],
    queryFn: orderService.getOrderStats,
  })

export const useGetSingleOrder = (orderId) =>
  useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getSingleOrder(orderId),
    enabled: !!orderId,
  })

export const useUpdateShippingAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, shippingAddress }) =>
      orderService.updateShippingAddress(orderId, shippingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    },
  })
}

// Update billing address
export const useUpdateBillingAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, billingAddress }) =>
      orderService.updateBillingAddress(orderId, billingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    },
  })
}

export const useTrackOrder = (trackingId) => {
  return useQuery(
    ['trackOrder', trackingId],
    () => orderService.trackOrder(trackingId),
    {
      enabled: !!trackingId,
    }
  )
}
