import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saleService } from "@/services/saleService";

// 🔹 GET product sales by product ID
export const useGetProductSales = (id) =>
  useQuery({
    queryKey: ["product-sales", id],
    queryFn: () => saleService.getProductSales(id),
    enabled: !!id,
  });

// 🔹 GET all sales
export const useGetAllSales = () =>
  useQuery({
    queryKey: ["all-sales"],
    queryFn: saleService.getAllSales,
  });

// 🔹 GET sales stats
export const useGetSalesStats = () =>
  useQuery({
    queryKey: ["sales-stats"],
    queryFn: saleService.getSalesStats,
  });

// 🔸 CREATE a sale
export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saleService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sales"]);
      queryClient.invalidateQueries(["sales-stats"]);
    },
  });
};

// 🔸 ADD products to sale
export const useAddProductsToSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ saleId, data }) =>
      saleService.addProductsToSale({ saleId, data }),
    onSuccess: (_, { saleId }) => {
      queryClient.invalidateQueries(["product-sales", saleId]);
    },
  });
};

// 🔸 REMOVE products from sale
export const useRemoveProductsFromSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saleService.removeProductsFromSale,
    onSuccess: (_, variables) => {
      const saleId = variables?.saleId;
      if (saleId) queryClient.invalidateQueries(["product-sales", saleId]);
    },
  });
};

// 🔸 UPDATE sale status
export const useUpdateSaleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => saleService.updateSaleStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["all-sales"]);
      queryClient.invalidateQueries(["product-sales", id]);
      queryClient.invalidateQueries(["sales-stats"]);
    },
  });
};

// 🔸 DELETE a sale
export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saleService.deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sales"]);
      queryClient.invalidateQueries(["sales-stats"]);
    },
  });
};
