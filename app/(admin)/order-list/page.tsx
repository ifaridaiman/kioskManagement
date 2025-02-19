/* eslint-disable @typescript-eslint/no-explicit-any */
  
"use client";

import HeaderTop from "@/components/Header/Top";
import React, { useEffect, useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";

const OrderList = () => {
   
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/order?page=1&limit=5&orderType=1");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch orders.");
        }

        setOrders(result.data);
       
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  return (

    <>
      <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl">
        <HeaderTop title="Order List" description="Update Stocks" />
        <hr className="mb-4" />

        {loading && <p className="text-center text-gray-500">Loading orders...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full rounded-tl-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 text-left px-4 text-gray-500 font-semibold">Order ID</th>
                <th className="py-2 text-left px-4 text-gray-500 font-semibold">Quantity</th>
                <th className="py-2 text-left px-4 text-gray-500 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId} className="border-b">
                    <td className="py-2 px-4">{order.orderId}</td>
                    <td className="py-2 px-4">
                      
                      {order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <LuPencilLine size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <MdOutlineDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrderList;
