"use client";
import NavbarStaff from "@/components/Navbar/NavbarStaff";
import React, { useEffect, useState } from "react";
import UpdateStatusModal from "./_components/UpdateStatusModal"; // Import the modal

interface Customer {
  name: string;
}

interface Menu {
  title: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  menus: Menu;
}

interface OrderStatus {
  status: "ready_to_pickup" | "completed" | string;
}

interface Order {
  id: string;
  customers: Customer;
  order_items: OrderItem[];
  order_statuses: OrderStatus[];
}

const OrderListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Ready" | "Completed">("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, searchTerm, orders]);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: { success: boolean; data: Order[] } = await response.json();
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Filter orders based on activeTab and searchTerm
  const filterOrders = () => {
    let filtered: Order[] = [...orders];

    if (activeTab === "Ready") {
      filtered = filtered.filter((order) =>
        order.order_statuses.some((status) => status.status === "ready_to_pickup")
      );
    } else if (activeTab === "Completed") {
      filtered = filtered.filter((order) =>
        order.order_statuses.some((status) => status.status === "completed")
      );
    }

    // Apply search filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  return (
    <>
      <NavbarStaff />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="flex flex-col justify-between flex-grow md:my-4 rounded-md">
          <div className="bg-white flex flex-col flex-grow rounded-t-3xl w-full mt-16 p-4">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 border-b">
              {(["All", "Ready", "Completed"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 text-lg font-medium ${
                    activeTab === tab
                      ? "border-b-4 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full mt-4">
              <input
                type="text"
                placeholder="Search order..."
                className="border px-4 py-2 shadow-md rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="text-sm font-semibold mt-4">
              {filteredOrders.length} Orders Left
            </p>

            {/* Order List */}
            <div className="mt-4 space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg shadow">
                    <p className="font-bold text-lg">
                      <span>{order.id.slice(-6)}</span> - <span>{order.customers.name}</span>
                    </p>
                    <p className="text-gray-600">{order.order_items.length} Items</p>

                    {/* Order Items */}
                    {order.order_items.map((item) => (
                      <div key={item.id} className="grid grid-cols-2 py-2 border-b last:border-none px-2">
                        <p>{item.menus.title}</p>
                        <p>{item.quantity}</p>
                      </div>
                    ))}

                    {/* Order Status */}
                    <div className="flex justify-between mt-4">
                      <div className={`rounded-full font-semibold p-2 ${
                        order.order_statuses.some(status => status.status === "ready_to_pickup")
                          ? "bg-green-300 text-green-500"
                          : "bg-blue-300 text-blue-500"
                      }`}>
                        {order.order_statuses[0]?.status.replace("_", " ")}
                      </div>

                      {/* Open Modal on Click */}
                      <button className="bg-primary text-white px-4 py-2 rounded-md"
                        onClick={() => setSelectedOrderId(order.id)}>
                        Update Status
                      </button>
                    </div>
                  </div>
                ))
              ) : <p className="text-gray-500 text-center mt-4">No orders found.</p>}
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
