"use client";
import HeaderTop from "@/components/Header/Top";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";

const OrderList = () => {
  return (
    <>
      <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl ">
        <HeaderTop
          title="Order List"
          description="Update Stocks "
        ></HeaderTop>
        <hr className="mb-4" />
        {/* Create Tab to differentiate between type */}
        <table className="w-full rounded-tl-md">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="py-2 text-left px-4  text-gray-500 font-semibold">
                Order ID
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Quantity
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <p>Loading menus...</p>
                </td>
              </tr>
            ) : inventories.length > 0 ? (
              inventories.map((inventory) => (
                <tr key={inventory.id}>
                  <td className="px-4 py-2">
                    {new Date(inventory.dateStart).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">{inventory.quantity}</td>
                  <td className="px-4 py-2 flex flex-row gap-4">
                    <button>
                      <LuPencilLine />
                    </button>

                    <button>
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <p>No menus found.</p>
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderList;
