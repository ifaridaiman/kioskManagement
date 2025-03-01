"use client";
import React, { useState, useEffect } from "react";
import MenuContainer from "@/app/_components/MenuContainer";
import TabsContainer from "@/components/Tabs/TabsContainer";
import FullPageLoader from "@/components/Loader/FullPageLoader";

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
  
  const tabs = [
    {
      label: "Daily",
      content: (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-2">
            <MenuContainer slug="Lemang" menus={menuItems} />
          </div>
        </div>
      ),
      description: "This order will be closed at 3.00Pm everyday. after r.00 PM order will be consider as tomorrow order",
    },
    {
      label: "Raya Order",
      content: <div>Raya Order Content</div>,
      description: "Raya Order Content",
    },
    {
      label: "Special Order",
      content: <div>Special Order Content</div>,
      description: "Special Order Content"
    },
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setTimeout(() => {
        const newUserId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem("user_id", newUserId);
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="md:max-w-80 mx-auto">
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
        <div className="sticky bottom-0 z-10 bg-white w-full border-t px-4 py-4">
          <button className="bg-primary text-white p-4 rounded-xl flex justify-between items-center w-full">
            <div className="flex justify-center items-center">
              <span className="font-bold">Basket</span>
              <span className="ml-2 text-white p-1 rounded-full">
                {/* {Object.keys(counts).length} items */}
              </span>
            </div>
            {/* <span>RM {calculateTotalPrice()}</span> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDaily;
