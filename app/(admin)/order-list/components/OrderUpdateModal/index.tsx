'use client'
import React, { useEffect, useState } from "react";
import { Order } from "../../types/order";

interface OrderUpdateModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedOrder: Partial<Order>) => void;
}

const OrderUpdateModal: React.FC<OrderUpdateModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [status, setStatus] = useState(order?.status || "");
  const [deliveryMethod, setDeliveryMethod] = useState(order?.delivery_method || "");

  // ✅ Update local state when `order` changes
  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setDeliveryMethod(order.delivery_method);
    }
  }, [order]);

  // ✅ Handle submitting the update
  const handleSubmit = async () => {
    if (!order) return;

    try {
      const response = await fetch("/api/orders/list/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          newStatus: status,
          newDeliveryMethod: deliveryMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order.");
      }

      onUpdate({ id: order.id, status, delivery_method: deliveryMethod });
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Update Order</h2>

        {/* Status Dropdown */}
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-md px-2 py-1 mb-4"
        >
          <option value="new">New</option>
          <option value="processed">Processed</option>
          <option value="ready_to_pickup">Ready to Pickup</option>
          <option value="completed">Completed</option>
        </select>

        {/* Delivery Method Dropdown */}
        <label className="block text-sm font-medium">Delivery Method</label>
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          className="w-full border rounded-md px-2 py-1 mb-4"
        >
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
        </select>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderUpdateModal;
