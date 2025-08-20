"use client";

import { useState, useEffect } from "react";

const OrderDetail = ({ order, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(order?.status || "");

  useEffect(() => {
    // Update local status if order prop changes
    setStatus(order?.status || "");
  }, [order]);

  const handleUpdate = () => {
    if (onUpdateStatus && order) {
      onUpdateStatus(order._id, status); // call parent mutation
    }
    onClose(); // close modal
  };

  if (!order) return null; // render nothing if no order selected

  return (
    <div className="p-4 space-y-4 bg-white rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Order #{order._id}</h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>User:</strong> {order.customer.name} ({order.customer.phone})
        </p>
        <p>
          <strong>Address:</strong> {order.customer.address.line1}, {order.customer.address.city}
        </p>
        <p>
          <strong>Total:</strong> ${order.total}
        </p>
      </div>

      <h3 className="font-medium mt-4">Items</h3>
      <ul className="list-disc list-inside text-gray-600">
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.productName || item.product?.name} × {item.quantity}
          </li>
        ))}
      </ul>

      {/* Update Status */}
      <div className="space-y-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded p-2">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>

        <button onClick={handleUpdate} className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
