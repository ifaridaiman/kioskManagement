import React from "react";

// ✅ Define Props Type
// ✅ Define TypeScript Interfaces

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
  address: string;
  id: string;
  name: string;
  email: string;
  phone_number: string;
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
                  {order.id.slice(-6)} - {order.customers.name}
                </p>

                <p className="text-gray-800 text-sm font-light">
                  {new Date(
                    order.order_items[0].menu_inventories.end_date
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  ({order.delivery_method})
                </p>
              </div>

              {/* ✅ Order Status */}
              <div className="grid grid-cols-3">
                <div>
                  <p className="text-gray-800 text-sm font-medium">
                    Phone Number:{" "}
                    <span className="font-semibold text-gray-700">
                      {order.customers.phone_number}
                    </span>
                  </p>
                  <p className="text-gray-700 text-sm font-medium mb-2">
                    Status:{" "}
                    <span className="font-semibold">{latestStatus}</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-2">
                    Address:
                  </p>
                  <p className="text-gray-700 text-sm mb-2 font-semibold">
                    {order.customers.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-2">
                    Total Amount:
                  </p>
                  <p className="text-gray-700 text-sm mb-2 font-semibold">
                    RM{" "}
                    {order.order_items
                      .filter((item) => item.menus)
                      .reduce((total, item) => {
                        return (
                          total + item.quantity * parseFloat(item.menus.price)
                        );
                      }, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>

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
