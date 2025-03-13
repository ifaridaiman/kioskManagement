"use client";
import React, { useEffect, useState } from "react";
import HeaderTop from "@/components/Header/Top";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import StatusPill from "./components/StatusPill";
import OrderUpdateModal from "./components/OrderUpdateModal";
import { Order, OrdersApiResponse } from "./types/order";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const limit = 10; // Items per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const query = statusFilter ? `&orderStatus=${statusFilter}` : ""; // ✅ Properly apply filter
        const response = await fetch(
          `/api/orders/list?page=${page}&limit=${limit}${query}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const result: OrdersApiResponse = await response.json();
        setOrders(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, page]); // ✅ Re-fetch when filter or page changes

  const handleUpdate = (updatedOrder: Partial<Order>) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
  };

  return (
    <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl">
      <HeaderTop title="Order List" description="Update Stocks" />
      <hr className="mb-4" />

      <OrderUpdateModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdate}
      />

      {/* Status Filter & Pagination Controls */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="statusFilter" className="mr-2">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="processed">Processed</option>
            <option value="ready_to_pickup">Ready to Pickup</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 border rounded-md ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            Previous
          </button>
          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 border rounded-md ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading orders...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full rounded-tl-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Order ID
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Customer
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Quantity
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Status
              </th>
              <th className="py-2 text-center px-4 text-gray-500 font-semibold">
                Delivery Method
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="py-2 px-4">{order.id.slice(-6)}</td>
                  <td className="py-2 px-4">
                    {order.customer ? order.customer.name : "Unknown"}
                  </td>
                  <td className="py-2 px-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <p>
                          <span className="font-semibold">
                            {item.menu.title}
                          </span>{" "}
                          - <span>{item.quantity}</span>
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    {order.delivery_method === "pickup" ? "Pickup" : "Delivery"}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                    >
                      <LuPencilLine size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Are you sure you want to delete this order?"
                          )
                        )
                          return;

                        try {
                          const response = await fetch("/api/orders/list/delete", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: order.id }),
                          });

                          if (!response.ok) {
                            throw new Error("Failed to delete order.");
                          }

                          setOrders((prevOrders) =>
                            prevOrders.filter((o) => o.id !== order.id)
                          );
                        } catch (error) {
                          console.error("Error deleting order:", error);
                          alert("Failed to delete order.");
                        }
                      }}
                    >
                      <MdOutlineDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
