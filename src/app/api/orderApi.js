import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";

// 🔁 Mutations

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// 🔍 Queries

export const useGetAllOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getAllOrders,
  });

export const useGetSingleOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getSingleOrder(id),
    enabled: !!id,
  });
