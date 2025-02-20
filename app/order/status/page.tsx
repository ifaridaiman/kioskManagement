"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import StatusCard from "./components/StatusCard";

const OrderRaya = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderStatus = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/order/status/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch order status.");
      }

      setOrderData(result.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-80 mx-auto flex flex-col justify-between h-full">
      <div className="flex justify-center items-center p-4">
        {/* Logo */}
        <Image
          className="rounded-full border border-black"
          src={"/assets/logo/static/lemangtul_logo.jpeg"}
          height={100}
          width={100}
          alt="LE-MANGTUL"
        />
      </div>

      <div className="flex flex-col gap-4 h-full">
        {/* Order Tracker */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="text-base font-semibold text-gray-700 flex flex-col"
          >
            Phone Number
          </label>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="px-4 h-11 text-base border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <button
              onClick={fetchOrderStatus}
              className="bg-indigo-600 text-white px-4 rounded-md hover:bg-indigo-700 transition h-11"
              disabled={loading}
            >
              {loading ? "Loading..." : "Track"}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Display Order Status */}
        {orderData && (
          <>
            <div>
              <p>Order</p>
              <hr className="border border-gray-700" />
            </div>

            <div className="mt-4">
              <div className="mt-2 space-y-2">
                {orderData.orders.map((order: any, index: number) => (
                  <div key={index}>
                    {order.orderStatus.map((status: any, idx: number) => (
                      <StatusCard
                        key={idx}
                        status={status.status}
                        description={`Updated at: ${new Date(
                          status.createdAt
                        ).toLocaleString()}`}
                        order={order.orderItems}
                        orderId={order.orderId}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p>History</p>
              <hr className="border border-gray-700" />
            </div>

            <div className="mt-4">
              <div className="mt-2 space-y-2">
                {orderData.history.map((order: any, index: number) => (
                  <div key={index}>
                    {order.orderStatus.map((status: any, idx: number) => (
                      <StatusCard
                        key={idx}
                        status={status.status}
                        description={`Updated at: ${new Date(
                          status.createdAt
                        ).toLocaleString()}`}
                        order={order.orderItems}
                        orderId={order.orderId}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-center p-2">
        <p className="text-xs text-gray-500">Developed by Naisu Technology</p>
      </div>
    </div>
  );
};

export default OrderRaya;