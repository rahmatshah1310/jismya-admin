'use client';

import Modal from 'react-modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

import { useGetAllSales, useConnectProductsToSale } from '@/app/api/saleApi';

export default function ConnectProductToSaleModal({ productId, isOpen, onClose }) {
  const [selectedSaleId, setSelectedSaleId] = useState('');

  const { data: salesData, isLoading: salesLoading, isError } = useGetAllSales();
  const connectMutation = useConnectProductsToSale();

  const handleSubmit = async () => {
    if (!selectedSaleId) {
      toast.error('Please select a sale first.');
      return;
    }

    try {
      const res = await connectMutation.mutateAsync({
        saleId: selectedSaleId,
        productIds: [productId],
      });

      toast.success(res?.message || 'Product added to sale!');
      setSelectedSaleId('');
      onClose();
    } catch (error) {
      console.error('Attach error:', error);
      toast.error(typeof error === 'string' ? error : 'Something went wrong.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white p-6 rounded max-w-2xl mx-auto shadow-lg"
      overlayClassName="fixed inset-0 bg-black/40 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">Attach Product to Sale</h2>

      {salesLoading ? (
        <div className="text-center">
          <ClipLoader />
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load sales list.</p>
      ) : (
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedSaleId}
          onChange={(e) => setSelectedSaleId(e.target.value)}
        >
          <option value="">Select a sale</option>
          {salesData?.data?.map((sale) => (
            <option key={sale._id} value={sale._id}>
              {sale.saleName}
            </option>
          ))}
        </select>
      )}

      <div className="mt-6 flex gap-4 overflow-auto">
        <Button onClick={onClose} className="bg-gray-300 text-black w-full">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className={connectMutation.isPending?"text-gray-300 bg-blue-500 w-full":"bg-blue-500 text-white w-full "}
          disabled={connectMutation.isPending || !selectedSaleId}
        >
          {connectMutation.isPending ? 'Attaching...' : 'Attach'}
        </Button>
      </div>
    </Modal>
  );
}
