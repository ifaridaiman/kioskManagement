"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MenuContainer from "@/app/_components/MenuContainer";
import TabsContainer from "@/components/Tabs/TabsContainer";
import Link from "next/link";
import axios from "axios";
import {
  OrderType,
  MenuCategory,
  MenuResponse,
  AvailableDateResponse,
  AvailableDate,
} from "@/types/menuCategory";
import { clearOrder } from "@/store/slice/orderSlice";

const OrderDaily: React.FC = () => {
  const activeTab = useSelector(
    (state: RootState) => state.navigation.activeId
  );
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [menus, setMenus] = useState<MenuCategory[]>([]);
  const [isLoadingTabs, setIsLoadingTabs] = useState(true);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [isLoadingAvailableDate, setIsLoadingAvailableDate] = useState(true);
  const [availableDate, setAvailableDate] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // New state for selected pickup date
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingDate, setPendingDate] = useState<string | null>(null); // Temporary state for the new date

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrderTypes = async () => {
      try {
        const response = await axios.get<OrderType[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/types`
        );
        console.log("Order Types:", response.data);
        setOrderTypes(response.data);
      } catch (error) {
        console.error("Error fetching order types:", error);
      } finally {
        setIsLoadingTabs(false);
      }
    };

    fetchOrderTypes();
  }, []);

  useEffect(() => {
    const fetchAvailableDate = async () => {
      try {
        setIsLoadingAvailableDate(true);
        const response = await fetch(`/api/menus/date-available`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData: AvailableDateResponse = await response.json();
        setAvailableDate(jsonData.data);

        if (jsonData.data.length > 0) {
          setSelectedDate(jsonData.data[0].date); // ✅ Auto-select first available date
        }
      } catch (error) {
        console.error("Error fetching AvailableDate:", error);
      } finally {
        setIsLoadingAvailableDate(false);
      }
    };

    fetchAvailableDate();
  }, []);

  useEffect(() => {
    if (!selectedDate) return; // ✅ Wait for a valid selected date before fetching menus

    const fetchMenus = async () => {
      try {
        setIsLoadingMenus(true);

        const response = await fetch(`/api/menus/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedDate }), // ✅ Send selected pickup date in the request body
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData: MenuResponse = await response.json();

        const updatedMenus = jsonData.data.map((menu) => ({
          ...menu,
          menus: menu.menus.map((item) => ({
            ...item,
            inventoryId:
              item.inventory.length > 0 ? item.inventory[0].inventory_id : "", // ✅ Extract first inventory ID
          })),
        }));

        setMenus(updatedMenus);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setIsLoadingMenus(false);
      }
    };

    fetchMenus();
  }, [selectedDate]); // ✅ Re-fetch menus when selectedDate changes

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = event.target.value;

    // If the user selects the same date, do nothing
    if (selectedDate === newDate) return;

    // Show confirmation modal before clearing orders
    setShowModal(true);

    setPendingDate(newDate);
  };

  const handleConfirmDateChange = () => {
    if (pendingDate) {
      // ✅ Clear the orders
      dispatch(clearOrder());
      setSelectedDate(pendingDate); // Store the new date temporarily
      setPendingDate(null); // Reset the pending date
    }
    // ✅ Hide modal and update selectedDate with the new date
    setShowModal(false);
  };

  const tabs = orderTypes.map((orderType) => ({
    id: orderType.id,
    label: orderType.name,
    content: (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-2">
          {isLoadingMenus && <p>Loading menus...</p>}
          <div className="flex flex-col">
            {isLoadingAvailableDate && <p>Loading available date...</p>}
            <label className="font-semibold mb-2" htmlFor="pickupDate">Pickup Date</label>
            <select
              className="border p-2 rounded bg-white"
              name="pickupDate"
              id="pickupDate"
              value={selectedDate || ""}
              onChange={handleDateChange}
            >
              {availableDate.length > 0 ? (
                availableDate.map((item) => (
                  <option key={item.date} value={item.date}>
                    {item.date}
                  </option>
                ))
              ) : (
                <option value="">No available dates</option>
              )}
            </select>
          </div>
          <MenuContainer typeId={activeTab || ""} menus={menus} />
        </div>
      </div>
    ),
    description: orderType.description,
  }));

  const orderCount = useSelector((state: RootState) =>
    state.order.orders.reduce((total, order) => total + order.quantity, 0)
  );

  const totalPrice = useSelector((state: RootState) =>
    state.order.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    )
  );

  return (
    <>
      <div className="md:max-w-80 mx-auto">
        <div className="flex flex-col h-screen">
          {isLoadingTabs && <p>Loading tabs...</p>}
          <TabsContainer tabs={tabs} activeTab={activeTab} />
          <div className="sticky bottom-0 z-10 bg-white w-full border-t px-4 py-4">
            <Link
              href={"/order/customer-detail"}
              className={`bg-primary text-white p-4 rounded-xl flex justify-between items-center w-full ${
                orderCount === 0 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="flex justify-center items-center">
                <span className="font-bold">Basket</span>
                <span className="ml-2 text-white p-1 rounded-full">
                  {orderCount} items
                </span>
              </div>
              <span className="font-bold">RM {totalPrice.toFixed(2)}</span>
            </Link>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <p className="text-lg font-semibold">Confirm Tab Change</p>
            <p className="text-gray-600 mt-2">
              Switching pickup date will remove all selected orders. Are you
              sure?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleConfirmDateChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDaily;
