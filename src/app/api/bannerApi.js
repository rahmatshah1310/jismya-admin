// /app/hooks/useBannerMutations.js
import { useMutation, useQuery } from "@tanstack/react-query";
import { bannerService } from "@/app/services/bannerService";

// ✅ Create Banner
export const useCreateBannerMutation = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await bannerService.createBanner(formData);
      if (!response) throw new Error("Banner creation failed");
      return response;
    },
  });
};

// ✅ Delete Banner
export const useDeleteBannerMutation = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await bannerService.deleteBanner(id);
      if (!response) throw new Error("Banner deletion failed");
      return response;
    },
  });
};

// ✅ Update Banner
export const useUpdateBannerMutation = () => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await bannerService.updateBanner(id, data);
      if (!response) throw new Error("Banner update failed");
      return response;
    },
  });
};

// ✅ Fetch Banners (query, not mutation)
export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: bannerService.getBanners,
  });
};
