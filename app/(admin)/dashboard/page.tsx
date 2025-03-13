"use client";
import React, { useEffect, useState } from "react";
import ListCustomerOrder from "./partials/DigitSummary/components/ListCustomerOrder";

// ✅ Define TypeScript Interfaces
interface Menu {
  id: string;
  title: string;
  price: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  menus: Menu;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface OrderStatus {
  id: string;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  customers: Customer;
  delivery_method: string;
  created_at: string;
  order_statuses: OrderStatus[];
  order_items: OrderItem[];
}

// ✅ Dashboard Component
const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/dashboard/orders");
        const result = await response.json();

        if (!response.ok)
          throw new Error(result.error || "Failed to fetch orders.");

        setOrders(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="pt-10 px-8">
      {/* ✅ Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 font-semibold">Dashboard</h1>
      </div>

      {/* ✅ Summary Boxes */}
      <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          "Total Orders",
          "Orders Processed",
          "Orders Pending",
          "Completed Orders",
        ].map((title, index) => (
          <div key={index}>
            <p className="text-base text-gray-500 font-semibold">{title}</p>
            <p className="text-sm text-gray-500 font-light">Description</p>
            <p className="text-3xl text-gray-800 font-bold mt-4">
              {orders.length}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Orders List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ✅ Today's Orders */}
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 text-base font-semibold">
              Lemang Orders for Today
            </p>
            <p className="text-gray-500 text-base font-medium">
              {orders.length} orders for today
            </p>
          </div>

            <div className="mt-6 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length > 0 ? (
              <ListCustomerOrder orders={orders} />
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
            </div>
        </div>

        {/* ✅ Placeholder for "Lemang Sold" */}
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <p className="text-gray-800 text-base font-semibold">Lemang Sold</p>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800 text-base font-semibold">
                Customer Name
              </p>
              <p className="text-gray-800 text-base font-light">
                Pickup/Delivery Date
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
