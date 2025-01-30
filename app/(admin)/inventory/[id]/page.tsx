"use client";
import HeaderTop from "@/components/Header/Top";
import React from "react";
import { useParams } from "next/navigation";
import InventoryList from "./components/InventoryList";
import { useInventoryList } from "./components/InventoryList/hooks/useInventoryList";

const Inventory = () => {
  const params = useParams();
  const menuId = Number(params?.id) || 1;

  const { inventories, isLoading } = useInventoryList(menuId);

  return (
    <>
      <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl ">
        <HeaderTop
          title="Inventory Manager"
          description="Update Stocks "
        ></HeaderTop>
        <hr className="mb-4" />
        <InventoryList inventories={inventories} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Inventory;
