"use client";
import React, { useState } from "react";
import MenuCard from "./components/MenuCard";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import TabsContainer from "@/components/Tabs/TabsContainer";

interface MenuItem {
  name: string;
  price: number;
}

const menuItems: MenuItem[] = [
  { name: "Lemang XL", price: 2.5 },
  { name: "Lemang L", price: 2.5 },
  { name: "Lemang M", price: 2.5 },
  { name: "Serunding", price: 5.5 },

  // Add more menu items as needed
];

const OrderDaily: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleCardClick = (menuName: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [menuName]: (prevCounts[menuName] || 0) + 1,
    }));
  };

  const calculateTotalPrice = () => {
    return menuItems
      .reduce((total, item) => {
        const itemCount = counts[item.name] || 0;
        return total + itemCount * item.price;
      }, 0)
      .toFixed(2);
  };

  const tabs = [
    {
      label: "Daily",
      content: (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-2">
            <p className="text-black font-bold text-xl">Lemang</p>
            {menuItems.map((item) => {
              return (
                <MenuCard
                  key={item.name}
                  name={item.name}
                  price={`RM ${item.price.toFixed(2)}`}
                  onClick={() => handleCardClick(item.name)}
                  count={counts[item.name] || 0}
                />
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: "Raya Order",
      content: <div>Raya Order Content</div>,
    },
    {
      label: "Special Order",
      content: <div>Special Order Content</div>,
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      {/* <div className="sticky top-0 z-10 bg-white w-full px-8 pt-4 flex flex-col items-start">
        <p className="font-bold text-xl text-black">Daily Order</p>
        <Link
          className="text-base text-gray-800 font-medium flex justify-center items-center gap-2 mt-3"
          href={"/"}
        >
          <BsArrowLeft /> Back to order type selection
        </Link>
      </div> */}

      {/* Menu Cards Section */}

      <TabsContainer tabs={tabs} />

      {/* Basket Section */}
      <div className="sticky bottom-0 z-10 bg-white w-full border-t px-8 py-4">
        <button className="bg-primary text-white p-4 rounded-xl flex justify-between items-center w-full">
          <div className="flex justify-center items-center">
            <span className="font-bold">Basket</span>
            <span className="ml-2 text-white p-1 rounded-full">
              {Object.keys(counts).length} items
            </span>
          </div>
          <span>RM {calculateTotalPrice()}</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDaily;
