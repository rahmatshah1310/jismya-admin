"use client";

import { useState } from "react";
import { useUpdateOrderStatus, useGetAllOrders, useDeleteOrder } from "../api/orderApi";
import CreateOrderForm from "@/components/Modal/OrderModal";

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetAllOrders();
  console.log(orders, "orders....................");
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderModal, setOpenOrderModal] = useState();
  const [tempStatus, setTempStatus] = useState("");

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>;

  const handleModalOpen = () => {
    setOpenOrderModal(true);
  };

  const handleModalClose = () => {
    setOpenOrderModal(false);
  };

  const handleSaveStatus = () => {
    updateStatusMutation.mutate({ id: selectedOrder._id, status: tempStatus }, { onSuccess: () => setSelectedOrder(null) });
  };

  const handleDeleteOrder = (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      deleteOrderMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      {openOrderModal && <CreateOrderForm open={handleModalOpen} onClose={handleModalClose} />}

      {/* Orders Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.customer.name}</td>
                <td className="p-2">${order.total}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setTempStatus(order.status);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    View / Update
                  </button>
                  <button onClick={() => handleDeleteOrder(order._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-[400px] relative">
            <h2 className="text-xl font-semibold mb-4">Order #{selectedOrder._id}</h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.customer.name} ({selectedOrder.customer.phone})
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.customer.address.line1}, {selectedOrder.customer.address.city}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total}
            </p>

            <h3 className="font-medium mt-4">Update Status</h3>
            <select value={tempStatus} onChange={(e) => setTempStatus(e.target.value)} className="border rounded px-3 py-2 w-full mt-2">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Close
              </button>
              <button onClick={handleSaveStatus} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
