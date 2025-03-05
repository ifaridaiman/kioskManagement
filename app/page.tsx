"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MenuContainer from "@/app/_components/MenuContainer";
import TabsContainer from "@/components/Tabs/TabsContainer";
import Link from "next/link";
// import FullPageLoader from "@/components/Loader/FullPageLoader";

const OrderDaily: React.FC = () => {
  
  // Calculate total item count
  const orderCount = useSelector((state: RootState) =>
    state.order.orders.reduce((total, order) => total + order.quantity, 0)
  );

  // Calculate total RM (price × quantity)
  const totalPrice = useSelector((state: RootState) =>
    state.order.orders.reduce((total, order) => total + order.price * order.quantity, 0)
  );

  const mockMenus = [
    { id:"abs123",name: "Lemang XL", price: 2.5, stocks: 0 },
    { id:"abs124",name: "Lemang L", price: 2.5, stocks: 5 },
    { id:"abs125",name: "Lemang M", price: 2.5, stocks: 10 },
    { id:"abs126",name: "Serunding", price: 5.5, stocks: 10 },
  ];

  const tabs = [
    {
      id: "d1f5e8b0-8f4b-4b2e-9f1e-1c2d3e4f5g6h",
      label: "Daily",
      content: (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-2">
            <MenuContainer slug="Lemang" menus={mockMenus} />
          </div>
        </div>
      ),
      description: "This order will be closed at 3.00PM everyday.",
    },
    {
      id: "d1f5e8b0-8f4b-4b2e-9f1e-1c2d3e4f5g6i",
      label: "Raya",
      content: (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-2">
            <MenuContainer slug="Lemang" menus={mockMenus} />
          </div>
        </div>
      ),
      description: "This order will be closed at 3.00PM everyday.",
    },
  ];

  return (
    <div className="md:max-w-80 mx-auto">
      <div className="flex flex-col h-screen">
        <TabsContainer tabs={tabs} />
        {/* Basket Section */}
        <div className="sticky bottom-0 z-10 bg-white w-full border-t px-4 py-4">
          <Link href={'/order/customer-detail'} className={`bg-primary text-white p-4 rounded-xl flex justify-between items-center w-full ${orderCount === 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex justify-center items-center">
              <span className="font-bold">Basket</span>
              <span className="ml-2 text-white p-1 rounded-full">{orderCount} items</span>
            </div>
            <span className="font-bold">
              RM {totalPrice.toFixed(2)} 
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDaily;
