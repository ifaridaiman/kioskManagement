"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Extract params from URL

// Define types for order items
interface OrderItem {
  menuTitle: string;
  quantity: number;
}

// Define types for the entire order response
interface OrderResponse {
  name: string;
  orderNumber: string;
  phoneNumber: string;
  address: string;
  orderItems: OrderItem[];
}

// Define the possible fetch states
type FetchState = "loading" | "success" | "error";

const OrderDetailsPage: React.FC = () => {
  const { phoneNumber, orderNumber } = useParams(); // Extract from URL
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!phoneNumber || !orderNumber) {
      setFetchState("error");
      setErrorMessage("Invalid URL parameters");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setFetchState("loading");

        const response = await fetch("/api/orders/delivery-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, orderNumber }),
        });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: Unable to fetch order details`
          );
        }

        const data: OrderResponse = await response.json();
        setOrder(data);
        setFetchState("success");
      } catch (error) {
        setFetchState("error");
        setErrorMessage((error as Error).message);
      }
    };

    fetchOrderDetails();
  }, [phoneNumber, orderNumber]);

  if (fetchState === "loading") {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (fetchState === "error") {
    return <p className="text-center text-red-500">{errorMessage}</p>;
  }

  return (
    <div className="h-auto flex flex-col justify-top items-top bg-gray-100 px-4">
      <p className="font-bold text-xl text-left my-4">Order Details</p>
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-300">
        <div className="p-6">
          {/* Order Details */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">
              Customer Name:
            </p>
            <p className="text-gray-600">{order?.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">Order Number:</p>
            <p className="text-gray-600">{order?.orderNumber.slice(-6)}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">Phone Number:</p>
            <p className="text-gray-600">{order?.phoneNumber}</p>
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">
              Delivery Address:
            </p>
            <p className="text-gray-600 leading-relaxed">{order?.address}</p>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">Order Items:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {order?.orderItems.map((item, index) => (
                <li key={index}>
                  {item.menuTitle} - <strong>{item.quantity}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
