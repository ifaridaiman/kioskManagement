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
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [tomorrowOrders, setTomorrowOrders] = useState<Order[]>([]);
  const [todayOrderState, setTodayOrderState] = useState<{
    [key: string]: number;
  }>({});
  const [tomorrowOrderState, setTomorrowOrderState] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async (
      date: string | null,
      setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
      setOrderState: React.Dispatch<
        React.SetStateAction<{ [key: string]: number }>
      >
    ) => {
      try {
        const url = date
          ? `/api/dashboard/orders?date=${date}`
          : `/api/dashboard/orders`;
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok)
          throw new Error(result.error || "Failed to fetch orders.");

        setOrders(result.data || []);

        // ✅ Process and calculate order state
        const menuCount: { [key: string]: number } = {};
        result.data.forEach((order: Order) => {
          order.order_items.forEach((item) => {
            const menuTitle = item.menus.title;
            menuCount[menuTitle] = (menuCount[menuTitle] || 0) + item.quantity;
          });
        });

        setOrderState(menuCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Get today's and tomorrow's dates in YYYY-MM-DD format
    const todayReal = new Date();
    todayReal.setDate(todayReal.getDate() + 1); // ✅ Adjust today by +1 day
    const today = todayReal.toISOString().split("T")[0];

    const tomorrowReal = new Date();
    tomorrowReal.setDate(tomorrowReal.getDate() + 2); // ✅ Adjust tomorrow by +2 days
    const tomorrow = tomorrowReal.toISOString().split("T")[0];
    

    // ✅ Fetch today's orders (default)
    fetchOrders(today, setTodayOrders, setTodayOrderState);

    // ✅ Fetch tomorrow's orders (by passing `tomorrow` as the date param)
    fetchOrders(tomorrow, setTomorrowOrders, setTomorrowOrderState);
  }, []);

  return (
    <div className="pt-10 px-8">
      {/* ✅ Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 font-semibold">Dashboard</h1>
      </div>

      {/* ✅ Summary Boxes */}
      {/* <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100 grid grid-cols-1 lg:grid-cols-4 gap-4">
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
              {todayOrders.length}
            </p>
          </div>
        ))}
      </div> */}

      {/* ✅ Orders List - Today & Tomorrow */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ✅ Today's Orders */}
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 text-base font-semibold">
              Lemang Orders for Today
            </p>
            <p className="text-gray-500 text-base font-medium">
              {todayOrders.length} orders for today
            </p>
          </div>

          <div className="mt-6 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : todayOrders.length > 0 ? (
              <ListCustomerOrder orders={todayOrders} />
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        </div>

        {/* ✅ Today's Lemang Sales Summary */}
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <p className="text-gray-800 text-base font-semibold">{`Today's Lemang Sales`}</p>
          <div className="mt-6">
            {Object.entries(todayOrderState).length > 0 ? (
              Object.entries(todayOrderState).map(([menuTitle, quantity]) => (
                <div
                  key={menuTitle}
                  className="flex justify-between border-b py-2"
                >
                  <p className="text-gray-800">{menuTitle}</p>
                  <p className="text-gray-800 font-medium">{quantity}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-4">No orders for today</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Tomorrow's Orders */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 text-base font-semibold">
              Lemang Orders for Tomorrow
            </p>
            <p className="text-gray-500 text-base font-medium">
              {tomorrowOrders.length} orders for tomorrow
            </p>
          </div>

          <div className="mt-6 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : tomorrowOrders.length > 0 ? (
              <ListCustomerOrder orders={tomorrowOrders} />
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        </div>

        {/* ✅ Tomorrow's Lemang Sales Summary */}
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <p className="text-gray-800 text-base font-semibold">{`Tomorrow's Lemang Sales`}</p>
          <div className="mt-6">
            {Object.entries(tomorrowOrderState).length > 0 ? (
              Object.entries(tomorrowOrderState).map(
                ([menuTitle, quantity]) => (
                  <div
                    key={menuTitle}
                    className="flex justify-between border-b py-2"
                  >
                    <p className="text-gray-800">{menuTitle}</p>
                    <p className="text-gray-800 font-medium">{quantity}</p>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-500 mt-4">No orders for tomorrow</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
