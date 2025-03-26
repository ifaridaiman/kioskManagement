"use client";
import React, { useEffect, useState } from "react";
import ListCustomerOrder from "./partials/DigitSummary/components/ListCustomerOrder";

interface Menu {
  id: string;
  title: string;
  price: string;
}

interface MenuInventory {
  end_date: string; // Added menu inventory with end date
}

interface OrderItem {
  id: string;
  quantity: number;
  menus: Menu;
  menu_inventories: MenuInventory; // Added menu inventory reference
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address:string
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
  payment_method: string; // Added payment method
  status: string; // Added overall order status
}


const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderState, setOrderState] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/dashboard/orders?date=${selectedDate}`);
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Failed to fetch orders.");

        setOrders(result.data || []);

        // ✅ Calculate order summary
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

    fetchOrders();
  }, [selectedDate]); // Fetch orders whenever selectedDate changes

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedLocalDate = new Date(e.target.value);
    selectedLocalDate.setHours(0, 0, 0, 0); // Set time to midnight local time
  
    // Convert to UTC date before sending to API
    const utcDate = new Date(selectedLocalDate.getTime() - selectedLocalDate.getTimezoneOffset() * 60000);
    setSelectedDate(utcDate.toISOString().split("T")[0]);
  };
  
  
  return (
    <div className="pt-10 px-8">
      {/* ✅ Dashboard Header with Date Picker */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl text-gray-800 font-semibold">Dashboard</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Orders Summary Box */}
      <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
        <p className="text-gray-800 text-base font-semibold">{`Lemang Sales Summary for ${selectedDate}`}</p>
        <div className="mt-6">
          {Object.entries(orderState).length > 0 ? (
            Object.entries(orderState).map(([menuTitle, quantity]) => (
              <div key={menuTitle} className="flex justify-between border-b py-2">
                <p className="text-gray-800">{menuTitle}</p>
                <p className="text-gray-800 font-medium">{quantity}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No orders for this date</p>
          )}
        </div>
      </div>

      {/* ✅ Orders List */}
      <div className="mt-8 border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
        <div className="flex justify-between items-center">
          <p className="text-gray-800 text-base font-semibold">
            Orders for {selectedDate}
          </p>
          <p className="text-gray-500 text-base font-medium">
            {orders.length} orders found
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
    </div>
  );
};

export default Dashboard;
