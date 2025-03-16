"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface CollectionResponse {
  success: boolean;
  data?: { id: string };
  error?: string;
}

interface OrderResponse {
  success: boolean;
  bill?: { url: string };
  error?: string;
}

const TotalButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectionId, setCollectionId] = useState<string | null>(null);

  // Get total RM price from Redux
  const totalPrice = useSelector((state: RootState) =>
    state.order.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    )
  );

  const orderDetails = useSelector((state: RootState) => state.order);

  const fetchCollectionId = async () => {
    try {
      const response = await fetch(`/api/collection`);

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data: CollectionResponse = await response.json();

      if (!data.success || !data.data?.id) {
        throw new Error(data.error || "Invalid collection response");
      }

      

      setCollectionId(data.data?.id);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    fetchCollectionId();
  }, []);

  const handlePlaceOrder = async () => {
    if (!collectionId) {
      setError("Collection ID is not available. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${collectionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process the order.");
      }

      const data: OrderResponse = await response.json();


      if (data.bill?.url) {
        window.open(data.bill.url, "_self"); // Open payment page in the same tab
      } else {
        throw new Error(data.error || "Payment URL not found.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-10 bg-white w-full border-t px-4 py-4">
      <div className="flex justify-between p-4">
        <p className="font-bold text-lg">Total</p>
        <p className="font-bold text-lg">RM {totalPrice.toFixed(2)}</p>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div className="px-4">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !collectionId}
          className={`block w-full text-center bg-primary text-white py-4 rounded-lg font-semibold ${
            loading || !collectionId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default TotalButton;
