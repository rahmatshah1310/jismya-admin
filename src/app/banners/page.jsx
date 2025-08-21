'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Move,
  Image as ImageIcon,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 🔹 Import your API hooks + Modals
import {
  useBannersByDevice,
  useDeleteBannerMutation,
  useToggleStatus,
} from '@/app/api/bannerApi'
import CreateBannerModal from '@/components/Modal/BannerModals/CreateBannerModal'
import EditBannerModal from '@/components/Modal/BannerModals/EditBannerModal'
import ViewBannerModal from '@/components/Modal/BannerModals/ViewBannerModal'
import ReorderBannerModal from '@/components/Modal/BannerModals/ReorderBannerModal'
import DeleteBannerModal from '@/components/Modal/BannerModals/DeleleteBannerModal'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import ToggleSwitch from '@/components/ui/switch'
import { BannerSkeletonRow } from '@/components/ui/common/Skeleton'

const deviceConfigs = {
  laptop: { size: '1280x720', icon: Monitor, color: 'bg-blue-500' },
  tablet: { size: '900x300', icon: Tablet, color: 'bg-green-500' },
  mobile: { size: '500x200', icon: Smartphone, color: 'bg-purple-500' },
}

export default function BannersPage() {
  // State
  const [activeModal, setActiveModal] = useState(null)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [createDeviceType, setCreateDeviceType] = useState(null)
  const [activeStatuses, setActiveStatuses] = useState({})

  // Handlers
  const handleCreateBanner = (deviceType) => {
    setCreateDeviceType(deviceType)
    setActiveModal('create')
  }
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner)
    setActiveModal('edit')
  }
  const handleViewBanner = (banner) => {
    setSelectedBanner(banner)
    setActiveModal('view')
  }
  const handleDeleteBanner = (banner) => {
    setSelectedBanner(banner)
    setActiveModal('delete')
  }
  const handleReorderBanner = (banner) => {
    setSelectedBanner(banner)
    setActiveModal('reorder')
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedBanner(null)
    setCreateDeviceType(null)
  }

  // 🔹 Queries
  const { data: laptopBanners = [], isLoading: loadingLaptop } =
    useBannersByDevice('laptop')
  const { data: tabletBanners = [], isLoading: loadingTablet } =
    useBannersByDevice('tablet')
  const { data: mobileBanners = [], isLoading: loadingMobile } =
    useBannersByDevice('mobile')

  // 🔹 Mutations
  const deleteBanner = useDeleteBannerMutation()
  const toggleStatus = useToggleStatus()

  const handleToggle = (banner) => {
    setActiveStatuses((prev) => ({
      ...prev,
      [banner._id]: !banner.isActive,
    }))

    toggleStatus.mutate({ id: banner._id, isActive: !banner.isActive })
  }

  // 🔹 Map API data per device
  const bannersByDevice = {
    laptop: laptopBanners,
    tablet: tabletBanners,
    mobile: mobileBanners,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Banner Management
            </h1>
            <p className="text-muted-foreground">
              Manage your website banners for different devices
            </p>
          </div>
        </div>

        {/* Device Sections */}
        {Object.entries(deviceConfigs).map(([deviceType, config]) => {
          const Icon = config.icon
          const banners = bannersByDevice[deviceType] || []

          return (
            <Card key={deviceType}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="capitalize">
                        {deviceType} Banners
                      </CardTitle>
                      <CardDescription>
                        {config.size} resolution
                      </CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => handleCreateBanner(deviceType)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create {deviceType} Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(loadingLaptop && deviceType === 'laptop') ||
                (loadingTablet && deviceType === 'tablet') ||
                (loadingMobile && deviceType === 'mobile') ? (
                  <Table>
                    <TableBody>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <BannerSkeletonRow key={i} />
                      ))}
                    </TableBody>
                  </Table>
                ) : banners.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Title</TableHead>
                        <TableHead className="w-[200px] text-left pl-20">
                          Description
                        </TableHead>
                        <TableHead className="w-[100px] text-center">
                          Status
                        </TableHead>
                        <TableHead className="w-[80px] text-center">
                          Order
                        </TableHead>
                        <TableHead className="w-[200px] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banners.map((banner) => (
                        <TableRow key={banner.id} className="text-center">
                          <TableCell className="font-medium w-[250px] h-[100px]">
                            <div className="flex gap-x-4 items-center w-full overflow-hidden">
                              <Image
                                src={banner.imageUrl}
                                width={100}
                                height={100}
                                className="w-[100px] h-[100px] object-cover shrink-0"
                                alt=""
                              />
                              {/* Text wrapper MUST have max width + truncate */}
                              <span className="">{banner.heading}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="truncate block max-w-[200px]">
                              {banner.description}
                            </span>
                          </TableCell>

                          <TableCell>
                            <ToggleSwitch
                              isActive={
                                activeStatuses[banner._id] !== undefined
                                  ? activeStatuses[banner._id]
                                  : banner.isActive
                              }
                              onToggle={() => handleToggle(banner)}
                            />
                          </TableCell>
                          <TableCell>{banner.order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewBanner(banner)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditBanner(banner)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReorderBanner(banner)}
                              >
                                <Move className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBanner(banner)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No {deviceType} banners yet
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleCreateBanner(deviceType)}
                    >
                      Create your first banner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {/* Real Modals Integration */}
        {/* Create Modal */}
        <CreateBannerModal
          key={createDeviceType}
          onClose={closeModal}
          showCreateModal={activeModal === 'create'}
          deviceType={createDeviceType}
        />

        {/* Edit Modal */}
        {selectedBanner && (
          <EditBannerModal
            banner={selectedBanner}
            onClose={closeModal}
            showEditModal={activeModal === 'edit'}
          />
        )}

        {/* View Modal */}
        {selectedBanner && (
          <ViewBannerModal
            bannerId={selectedBanner._id}
            onClose={closeModal}
            showViewModal={activeModal === 'view'}
          />
        )}

        {/* Reorder Modal */}
        {selectedBanner && (
          <ReorderBannerModal
            banner={selectedBanner}
            onClose={closeModal}
            showReorderModal={activeModal === 'reorder'}
          />
        )}

        {/* Delete Modal */}
        {selectedBanner && (
          <DeleteBannerModal
            banner={selectedBanner}
            onClose={closeModal}
            showDeleteModal={activeModal === 'delete'}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

