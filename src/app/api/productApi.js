
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";

// 🔁 Mutations

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddDescriptionImages = () =>
  useMutation({ mutationFn: productService.addDescriptionImages });

export const useDeleteDescriptionImage = () =>
  useMutation({ mutationFn: productService.deleteDescriptionImage });

export const useUpdateProductOrder = () =>
  useMutation({ mutationFn: ({ id, data }) => productService.updateProductOrder(id, data) });

export const useCreateReview = () =>
  useMutation({ mutationFn: productService.createProductReview });

export const useCreateSale = () =>
  useMutation({ mutationFn: productService.createSale });

// 📦 Queries

export const useSingleProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getSingleProduct(id),
    enabled: !!id,
  });

export const useGetAllProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: productService.getAllProducts,
  });


export const useGetAllCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: productService.getAllCategories,
  });

export const useGetSizes = () =>
  useQuery({
    queryKey: ["sizes"],
    queryFn: productService.getSizes,
  });

export const useProductsBySize = (size) =>
  useQuery({
    queryKey: ["products-by-size", size],
    queryFn: () => productService.getProductsBySize(size),
    enabled: !!size,
  });

export const useProductsByCategory = (categoryName) =>
  useQuery({
    queryKey: ["products-by-category", categoryName],
    queryFn: () => productService.getProductsByCategory(categoryName),
    enabled: !!categoryName,
  });

export const useGetProductReviews = (id) =>
  useQuery({
    queryKey: ["product-reviews", id],
    queryFn: () => productService.getProductReviews(id),
    enabled: !!id,
  });

export const useGetProductSales = (id) =>
  useQuery({
    queryKey: ["product-sales", id],
    queryFn: () => productService.getProductSales(id),
    enabled: !!id,
  });

export const useGetAllSales = () =>
  useQuery({
    queryKey: ["all-sales"],
    queryFn: productService.getAllSales,
  });
