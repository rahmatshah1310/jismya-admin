'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import 'swiper/css'
import 'swiper/css/pagination'
import { useGetBanners, useDeleteBannerMutation, useBannersByDevice, useSingleBanner } from '@/app/api/bannerApi'
import CreateBannerModal from '@/components/Modal/CreateBannerModal'
import ProtectedRoute from '@/components/ProtectedRoute'
import EditBannerModal from '@/components/Modal/EditBannerModal'
import BannerTable from '@/components/tables/BannerTable'
import ViewBannerModal from '@/components/Modal/ViewBannerModal'
import ReorderBannerModal from '@/components/Modal/ReorderBannerModal'

export default function Home() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const { data, isLoading } = useGetBanners()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const deleteBanner = useDeleteBannerMutation()
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBannerId, setViewBannerId] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);
const [reorderBanner, setReorderBanner] = useState(null);

const handleReorderBanner = (banner) => {
  setReorderBanner(banner);
  setShowReorderModal(true);
};



  const handleViewBanner  = (bannerId) => {
    setViewBannerId(bannerId);
    setShowViewModal(true);
  };



  const { data: mobileBanners, isLoading: loadingMobile } = useBannersByDevice('mobile');
  const { data: laptopBanners, isLoading: loadingLaptop } = useBannersByDevice('laptop');
  const { data: tabletBanners, isLoading: loadingTablet } = useBannersByDevice('tablet');

  return (
    <ProtectedRoute>  <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 overflow-x-visible">
        <h1 className='text-center p-2 text-3xl '>Banners Management</h1>


        {
          showCreateModal && (
            <CreateBannerModal
              showCreateModal={showCreateModal}
              onClose={() => setShowCreateModal(false)}
            />
          )
        }

        {
          showEditModal && selectedBanner && (
            <EditBannerModal
              banner={selectedBanner}
              showEditModal={showEditModal}
              onClose={() => setShowEditModal(false)}
            />
          )
        }

        {showViewModal && viewBannerId && (
          <ViewBannerModal
            bannerId={viewBannerId}
            onClose={() => setShowViewModal(false)}
          />
        )}
 {
          showReorderModal && (
            <ReorderBannerModal
            banner={reorderBanner}
              showReorderModal={showReorderModal}
              onClose={() => setShowReorderModal(false)}
            />
          )
        }

        <Button onClick={() => setShowCreateModal(true)} className="mb-4 bg-green-500 text-white">Create Banner</Button>

        <BannerTable
          title="Laptop Banners"
          banners={laptopBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={setShowEditModal}
          deleteBanner={deleteBanner}
           handleViewBanner={handleViewBanner}
           handleReorderBanner={handleReorderBanner}
        />

        <BannerTable
          title="Tablet Banners"
          banners={tabletBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={setShowEditModal}
          deleteBanner={deleteBanner}
           handleViewBanner={handleViewBanner}
           handleReorderBanner={handleReorderBanner}
        />

        <BannerTable
          title="Mobile Banners"
          banners={mobileBanners}
          setSelectedBanner={setSelectedBanner}
          setShowEditModal={setShowEditModal}
          deleteBanner={deleteBanner}
           handleViewBanner={handleViewBanner}
           handleReorderBanner={handleReorderBanner}
        />
      </main>
    </main></ProtectedRoute>
  )
}
