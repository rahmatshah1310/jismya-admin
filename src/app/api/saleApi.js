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
export const useConnectProductsToSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saleService.addProductsToSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-sales"]);
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
    mutationFn: ({ id, isActive }) => saleService.updateSaleStatus(id, {isActive}),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["all-sales"]);
      queryClient.invalidateQueries(["product-sales", id]);
      queryClient.invalidateQueries(["sales-stats"]);
    },
  });
};



// 🔸 UPDATE sale (name, description, discount, etc.)
export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => saleService.updateSale(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["all-sales"]);
      queryClient.invalidateQueries(["product-sales", id]);
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

