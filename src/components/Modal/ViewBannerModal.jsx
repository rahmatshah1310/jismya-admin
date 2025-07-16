'use client'
import { useSingleBanner } from '@/app/api/bannerApi';
import Image from 'next/image';
import Modal from 'react-modal';
import Button from '../ui/Button';

export default function ViewBannerModal({ bannerId, onClose }) {
    const { data, isLoading, error } = useSingleBanner(bannerId);
    const banner = data?.data;

    return (
        <Modal
            isOpen={true}
            ariaHideApp={false}
            onRequestClose={onClose}
            contentLabel="View Banner Modal"
            className="bg-white w-full h-full flex flex-col md:max-w-3xl md:h-[80vh] rounded-lg shadow-lg overflow-hidden outline-none"
            overlayClassName="fixed inset-0 bg-black/25 z-50 flex items-center justify-center px-4 py-8"
        >
            {isLoading ? (
                <p className="p-4 flex justify-center items-center h-full">Loading...</p>
            ) : error ? (
                <p className="p-4 text-red-500">Failed to load banner</p>
            ) : (
                <div className="flex flex-col w-full h-full overflow-auto p-4 space-y-4">
                    <h2 className="text-3xl font-bold text-center break-words overflow-auto">{banner?.heading}</h2>
                    <Image src={banner?.imageUrl} width={300} height={300} alt="banner" className="w-full h-64 object-cover rounded" />
                    <div className="flex-1 space-y-2 text-lg break-words overflow-auto">
                        <p><strong>Description:</strong> {banner?.description}</p>
                        <p><strong>Device Type:</strong> {banner?.deviceType}</p>
                        <p><strong>Status:</strong> {banner?.isActive ? "Active" : "Inactive"}</p>
                        <p><strong>Order:</strong> {banner?.order}</p>
                    </div>
                    <Button onClick={onClose} className="mt-auto bg-red-500 text-white px-4 py-2 rounded w-full">Close</Button>
                </div>
            )}
        </Modal>
    )
}
