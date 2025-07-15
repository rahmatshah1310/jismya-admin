import { sendRequest } from "@/app/services/sendingRequests";

// ✅ Create Banner (Admin)
export const createBanner = async (data) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/banners", // adjust to your API endpoint
      data,
    });
    return response.data;
  } catch (error) {
    console.error("BannerService [createBanner] error:", error);
    throw error;
  }
};

// ✅ Get All Banners (Public or Admin)
export const getBanners = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/banners/all",
    });
    return response.data;
  } catch (error) {
    console.error("BannerService [getBanners] error:", error);
    throw error;
  }
};

// ✅ Delete Banner (Admin)
export const deleteBanner = async (id) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/banners/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error("BannerService [deleteBanner] error:", error);
    throw error;
  }
};

// ✅ Update Banner (optional)
export const updateBanner = async (id, data) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/banners/${id}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error("BannerService [updateBanner] error:", error);
    throw error;
  }
};

// ✅ Final export
export const bannerService = {
  createBanner,
  getBanners,
  deleteBanner,
  updateBanner,
};
