import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function BannerTable({ title, banners, setSelectedBanner, setShowEditModal, deleteBanner, handleViewBanner,handleReorderBanner }) {
    return (
        <section className="p-4 sm:p-6 ">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="block overflow-x-auto">
                <table className="w-full table-auto border text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 min-w-[140px]">Image</th>
                            <th className="p-2 min-w-[200px]">Heading</th>
                            <th className="p-2 min-w-[250px]">Description</th>
                            <th className="p-2 min-w-[120px]">Device</th>
                            <th className="p-2 min-w-[100px]">Status</th>
                            <th className="p-2 min-w-[80px]">Order</th>
                            <th className="p-2 min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners?.map(banner => (
                            <tr key={banner._id} className="border-t">
                                <td className="p-2 min-w-[140px]">
                                    <Image src={banner.imageUrl} alt="banner" width={120} height={60} className="rounded-md object-cover" />
                                </td>
                                <td className="p-2 min-w-[200px]">{banner.heading}</td>
                                <td className="p-2 min-w-[200px] max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">{banner.description}</td>
                                <td className="p-2 min-w-[120px]">{banner.deviceType}</td>
                                <td className="p-2 min-w-[100px]">
                                    <span className={`font-semibold ${banner.isActive ? "text-green-500" : "text-red-500"}`}>
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-2 min-w-[80px]">{banner.order}</td>
                                <td className="p-2 min-w-[350px] space-x-2">
                                    <Button
                                        onClick={() => handleViewBanner(banner._id)}
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                    >
                                        View
                                    </Button>
                                    <Button onClick={() => { setSelectedBanner(banner); setShowEditModal(true); }} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm">Edit</Button>
                                    <Button onClick={() => deleteBanner.mutate(banner._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</Button>
                                    <Button onClick={() => handleReorderBanner(banner)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                                        Reorder
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
