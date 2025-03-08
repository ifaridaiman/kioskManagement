"use client";
import NavbarStaff from "@/components/Navbar/NavbarStaff";
import React, { useState } from "react";

const OrderListPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <NavbarStaff />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="flex flex-col justify-between flex-grow md:my-4 rounded-md">
          <div className="bg-white flex flex-col flex-grow rounded-t-3xl w-full mt-16 p-4">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 border-b">
              {["All", "Ready", "Completed"].map((tab) => (
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

            {/* Content */}
            <div className="flex flex-col flex-grow overflow-auto">
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Search order..."
                    className="border px-4 py-2 shadow-md rounded-md w-full"
                  />
                </div>

                <p className="text-sm font-semibold">10 Orders Left</p>
              </div>

              {/* Order List */}
              <div>
                <div className="mt-4 space-y-4">
                  <div className="p-4 border rounded-lg shadow">
                    <p className="font-bold text-lg">
                      <span>{"LMG-001"}</span> - <span>{"Arif Lukman"}</span>
                    </p>
                    <p className="text-gray-600">3 Items</p>

                    <div className="grid grid-cols-2 bg-slate-300 py-2 mt-2">
                      <p>Item Name</p>
                      <p>Qty</p>
                    </div>

                    <div className="flex justify-between mt-4">
                      <div className="text-green-500 rounded-full bg-green-300 font-semibold p-2  ">
                        Ready To Pickup
                      </div>
                      <button className="bg-primary text-white px-4 py-2 rounded-md">
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add more orders dynamically based on data */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderListPage;
