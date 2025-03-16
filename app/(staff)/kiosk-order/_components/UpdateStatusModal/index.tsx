"use client";

import React, { useState } from "react";

interface UpdateStatusModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  orderId,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/statuses/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      onStatusUpdated();
      onClose();
    } catch {
      setError("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
        <p className="text-gray-700">Are you sure you want to mark this order as <b>Completed</b>?</p>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={handleUpdateStatus}
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
