"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  useGetBanners,
  useDeleteBannerMutation,
  useBannersByDevice,
  useToggleStatus,
} from "@/app/api/bannerApi";
import CreateBannerModal from "@/components/Modal/CreateBannerModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditBannerModal from "@/components/Modal/EditBannerModal";
import BannerTable from "@/components/tables/BannerTable";
import ViewBannerModal from "@/components/Modal/ViewBannerModal";
import ReorderBannerModal from "@/components/Modal/ReorderBannerModal";
import DeleteBannerModal from "@/components/Modal/DeleleteBannerModal";

export default function Home() {
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'view' | 'reorder'
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [viewBannerId, setViewBannerId] = useState(null);
  const [createDeviceType, setCreateDeviceType] = useState(null);
  const toggleStatus = useToggleStatus();

  const handleToggle = (id, currentStatus) => {
    toggleStatus.mutate({ id, isActive: !currentStatus });
  };

  const { data: laptopBanners, isLoading: loadingLaptop } =
    useBannersByDevice("laptop");
  const { data: tabletBanners, isLoading: loadingTablet } =
    useBannersByDevice("tablet");
  const { data: mobileBanners, isLoading: loadingMobile } =
    useBannersByDevice("mobile");

  const deleteBanner = useDeleteBannerMutation();

  const openCreateModal = (deviceType) => {
    setCreateDeviceType(deviceType);
    setActiveModal("create");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedBanner(null);
    setCreateDeviceType(null);
    setViewBannerId(null);
  };
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setActiveModal("edit");
  };

  const handleViewBanner = (bannerId) => {
    setViewBannerId(bannerId);
    setActiveModal("view");
  };

  const handleReorderBanner = (banner) => {
    setSelectedBanner(banner);
    setActiveModal("reorder");
  };

  const handleDeleteBanner = (banner) => {
    setSelectedBanner(banner);
    setActiveModal("delete");
  };

  return (
    <ProtectedRoute>
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 overflow-x-visible">
        <h1 className="text-center p-2 text-5xl">Banners Management</h1>

        {/* <div className="flex justify-end mb-4">
          <Button
            onClick={() => setActiveModal("create")}
            className="w-full rounded sm:w-auto bg-green-500 text-white"
          >
            Create Banner
          </Button>
        </div> */}

        {/* Modals */}
        {activeModal === "create" && (
          <CreateBannerModal
            onClose={closeModal}
            deviceType={createDeviceType}
          />
        )}

        {activeModal === "edit" && selectedBanner && (
          <EditBannerModal banner={selectedBanner} onClose={closeModal} />
        )}
        {activeModal === "view" && viewBannerId && (
          <ViewBannerModal bannerId={viewBannerId} onClose={closeModal} />
        )}
        {activeModal === "reorder" && selectedBanner && (
          <ReorderBannerModal banner={selectedBanner} onClose={closeModal} />
        )}
        {activeModal === "delete" && selectedBanner && (
          <DeleteBannerModal banner={selectedBanner} onClose={closeModal} />
        )}

        <div className="flex justify-end pt-10">
          <Button
            onClick={() => openCreateModal("laptop")}
            className="bg-green-500 text-white rounded"
          >
            Create Laptop Banner
          </Button>
        </div>

        {/* Laptop Banners */}
        <BannerTable
          title="Laptop Banners"
          banners={laptopBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={() => setActiveModal("edit")}
          deleteBanner={deleteBanner}
          handleViewBanner={handleViewBanner}
          handleReorderBanner={handleReorderBanner}
          handleDeleteBanner={handleDeleteBanner}
          handleEditBanner={handleEditBanner}
          handleToggle={handleToggle}
        />

        <div className="flex justify-end mt-10">
          <Button
            onClick={() => openCreateModal("tablet")}
            className="bg-green-500 rounded text-white"
          >
            Create Tablet Banner
          </Button>
        </div>
        {/* Tablet Banners */}
        <BannerTable
          title="Tablet Banners"
          banners={tabletBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={() => setActiveModal("edit")}
          deleteBanner={deleteBanner}
          handleViewBanner={handleViewBanner}
          handleReorderBanner={handleReorderBanner}
          handleDeleteBanner={handleDeleteBanner}
          handleEditBanner={handleEditBanner}
          handleToggle={handleToggle}
        />

        <div className="flex justify-end pt-10">
          <Button
            onClick={() => openCreateModal("mobile")}
            className="bg-green-500 rounded text-white"
          >
            Create Mobile Banner
          </Button>
        </div>
        {/* Mobile Banners */}
        <BannerTable
          title="Mobile Banners"
          banners={mobileBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={() => setActiveModal("edit")}
          deleteBanner={deleteBanner}
          handleViewBanner={handleViewBanner}
          handleReorderBanner={handleReorderBanner}
          handleDeleteBanner={handleDeleteBanner}
          handleEditBanner={handleEditBanner}
          handleToggle={handleToggle}
        />
      </main>
    </ProtectedRoute>
  );
}
