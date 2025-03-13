import React from "react";

// ✅ Define Props Type
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

interface ListCustomerOrderProps {
  orders: Order[];
}

const ListCustomerOrder: React.FC<ListCustomerOrderProps> = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => {
          // ✅ Get latest order status (sorted by created_at)
          const latestStatus =
            order.order_statuses.length > 0
              ? order.order_statuses[0].status
              : "Unknown";

          return (
            <div
              key={order.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              {/* ✅ Customer & Pickup/Delivery Date */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 text-base font-semibold">
                  {order.id.slice(-6)}
                </p>
                <p className="text-gray-800 text-sm font-light">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}{" "}
                  ({order.delivery_method})
                </p>
              </div>

              {/* ✅ Order Status */}
              <p className="text-gray-700 text-sm font-medium mb-2">
                Status: <span className="font-semibold">{latestStatus}</span>
              </p>

              {/* ✅ Order Items */}
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-gray-800 text-base font-semibold">
                  Order Items
                </p>
                <div className="mt-2 space-y-1">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <p className="text-gray-800 text-sm font-medium">
                        {item.menus.title}
                      </p>
                      <p className="text-gray-800 text-sm font-light">
                        x{item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default ListCustomerOrder;
