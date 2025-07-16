import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerService } from "@/app/services/bannerService";

// ✅ Create Banner
export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bannerService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ['banners-device'] });
    }
  });
};

// ✅ Delete Banner
export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bannerService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ['banners-device'] });
    }
  });
};

// ✅ Update Banner
export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bannerService.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-device'] });

    }
  });
};

// ✅ Reorder Banner
export const useReorderBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bannerService.reorderBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-device'] });
    }
  });
};

// ✅ Fetch All Banners
export const useGetBanners = () =>
  useQuery({
    queryKey: ["banners"],
    queryFn: bannerService.getBanners,
  });

// ✅ Get Single Banner
export const useSingleBanner = (id) =>
  useQuery({
    queryKey: ["banner", id],
    queryFn: () => bannerService.getSingleBanner(id),
    enabled: !!id,
  });

// ✅ Get Category Banners
export const useBannersByDevice = (deviceType) =>
  useQuery({
    queryKey: ["banners-device", deviceType],
    queryFn: () => bannerService.getBannersByDevice(deviceType),
    onSuccess: () => {
    },
    enabled: !!deviceType,
  });
