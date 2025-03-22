"use client";
import NavbarStaff from "@/components/Navbar/NavbarStaff";
import React, { useEffect, useState } from "react";
import UpdateStatusModal from "./_components/UpdateStatusModal"; // Import the modal
import Link from "next/link";

interface Customer {
  name: string;
  phone_number: string;
}

interface Menu {
  title: string;
}

interface PickupDate {
  end_date: string;
}

interface Item {
  id: string;
  quantity: number;
  menu: Menu;
  pickupDate: PickupDate;
}

interface Order {
  id: string;
  customer: Customer;
  items: Item[];
  status: string;
}

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `/api/orders/list/delivery?page=1&limit=10`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const result = await response.json();
      setOrders(result.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrders = () => {
    const filtered = orders.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone_number.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <>
      <NavbarStaff />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="flex flex-grow rounded-md">
          <div className="bg-white flex flex-col flex-grow rounded-t-3xl w-full mt-16 p-4 mx-8">
            {/* Search Bar */}
            <div className="w-full mt-4">
              <input
                type="text"
                placeholder="Search order by name, phone or ID..."
                className="border px-4 py-2 shadow-md rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="text-sm font-semibold mt-4">
              {filteredOrders.length} Orders Found
            </p>

            {/* Orders Display */}
            <div className="mt-4 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg shadow bg-gray-50"
                >
                  <p className="text-lg font-bold">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.customer.phone_number}
                  </p>
                  <p className="text-sm mt-2">Order ID: {order.id.slice(-6)}</p>
                  <p className="text-sm">
                    Status: {order.status.replace(/_/g, " ")}
                  </p>

                  <div className="mt-6">
                    <p className="font-bold mb-2">Order Items</p>
                    <div className="bg-slate-200 px-4 rounded py-6">
                      {order.items.map((item, index) => {
                        return (
                          <div key={index} className="flex justify-between">
                            <p>{item.menu.title}</p>
                            <p>{item.quantity}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-4">
                    <Link
                      target="_blank"
                      className="mt-4 bg-slate-500 text-white text-center px-4 py-2 rounded-md"
                      href={`/order/${order.customer.phone_number}/${order.id}`}
                    >
                      Check Address
                    </Link>

                    <button
                      className="mt-4 bg-primary text-white px-4 py-2 rounded-md"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        orderId={selectedOrderId || ""}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdated={fetchOrders}
      />
    </>
  );
};

export default OrderListPage;
