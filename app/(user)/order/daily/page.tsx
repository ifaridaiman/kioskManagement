"use client";
import React, { useState } from "react";
import MenuCard from "../components/MenuCard";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

interface MenuItem {
  name: string;
  price: number;
}

const menuItems: MenuItem[] = [
  { name: "Lemang XL", price: 2.50 },
  { name: "Lemang L", price: 2.50 },
  { name: "Lemang M", price: 2.50 },
  { name: "Serunding", price: 5.50 },
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
    return menuItems.reduce((total, item) => {
      const itemCount = counts[item.name] || 0;
      return total + itemCount * item.price;
    }, 0).toFixed(2);
  };

  return (
    <div className=" flex flex-col justify-between h-screen">
      <div className="min-w-96 mx-auto px-8">
        <div className="flex flex-col justify-start items-start pt-4">
          <p className="font-bold text-xl text-black">Daily Order</p>
          <Link
            className="text-base text-gray-800 font-medium flex justify-center items-center gap-2 mt-3"
            href={"/"}
          >
            {" "}
            <BsArrowLeft /> Back to order type selection
          </Link>
        </div>
        <div className="flex flex-col justify-top items-top gap-4 pt-12">
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => {
              
              return(
              <MenuCard
                key={item.name}
                name={item.name}
                price={`RM ${item.price.toFixed(2)}`}
                onClick={() => handleCardClick(item.name)}
                count={counts[item.name] || 0}
              />
            )})}
          </div>
        </div>
      </div>

      <div className="text-center pt-12 pb-8 sticky bottom-0 w-full bg-white border-t">
        <button className="bg-primary text-white p-4 rounded-xl flex justify-between items-center w-80 mx-auto">
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