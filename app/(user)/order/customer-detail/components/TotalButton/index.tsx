"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const TotalButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get total RM price from Redux
  const totalPrice = useSelector((state: RootState) =>
    state.order.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    )
  );

  const orderDetails = useSelector((state: RootState) => state.order);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/0195736f-5efb-70d9-adfc-c2e05db55919`,
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

      const data = await response.json(); // Parse JSON response
      if (data?.bill?.url) {
        window.open(data.bill.url, "_blank"); // Open payment page in new tab
      } else {
        throw new Error("Payment URL not found.");
      }

      // Redirect to summary page after successful order placement
      // window.location.href = "/order/summary";
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
          disabled={loading}
          className={`block w-full text-center bg-primary text-white py-4 rounded-lg font-semibold ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default TotalButton;
