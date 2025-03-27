"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import StatusCard from "./components/StatusCard";
import FullPageLoader from "@/components/Loader/FullPageLoader";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";

const OrderRaya: React.FC = () => {
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

    setOrderData(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?phoneNumber=${phoneNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

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
    <>
      <NavbarCustomer />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="max-w-80 mx-auto flex flex-col justify-between flex-grow md:my-4 rounded-md">
          <div className="flex justify-start items-start pt-8 pb-4">
            {/* Logo */}
            <p className="text-white font-bold text-xl">Order Tracker</p>
          </div>

          <div className="flex flex-col gap-4 flex-grow">
            {/* Order Tracker */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="text-base font-semibold text-white flex flex-col"
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
                  placeholder="Enter your phone number"
                />
                <button
                  onClick={fetchOrderStatus}
                  className="bg-white px-4 rounded-md hover:bg-indigo-700 transition h-11 text-primary font-bold"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Track"}
                </button>
              </div>
              {loading && <FullPageLoader />}
              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Display Order Status */}
            {orderData && (
              <>
                <div>
                  <p className="text-white font-bold text-lg mb-2">Order</p>
                  <hr className="border border-white" />
                </div>

                <div className="mt-2">
                  <div className="space-y-2">
                    {orderData && (
                      <>
                        <div className="mt-2">
                          <div className="space-y-2">
                            {orderData.length > 0 ? (
                              orderData.map((order: any) => (
                                <StatusCard
                                  key={order.id}
                                  status={
                                    order.statuses.length > 0
                                      ? order.statuses[
                                          order.statuses.length - 1
                                        ].status
                                      : "Unknown"
                                  }
                                  description={`Updated at: ${
                                    order.statuses.length > 0
                                      ? new Date(
                                          order.statuses[
                                            order.statuses.length - 1
                                          ].created_at
                                        ).toLocaleString()
                                      : "No date"
                                  }`}
                                  order={order.order_item}
                                  orderId={order.id}
                                  payment={order.payment}
                                />
                              ))
                            ) : (
                              <p className="text-white text-sm font-semibold">
                                No order from this number.
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center p-2">
            <p className="text-xs text-white">Developed by Naisu Technology</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderRaya;
