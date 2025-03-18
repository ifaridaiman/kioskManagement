"use client";
import HeaderTop from "@/components/Header/Top";
import React from "react";
import { useParams } from "next/navigation";
import InventoryList from "./components/InventoryList";
import { useInventoryList } from "./components/InventoryList/hooks/useInventoryList";
import { useInventory } from "./hooks/useInventory";
import InventoryAdd from "./components/InventoryAdd";

const Inventory = () => {
  const params = useParams();
  const menuId = params?.id as string;
  const { inventories, menuName, isLoading, refreshInventories, deleteInventory, currentPage, setCurrentPage, totalPages } = useInventoryList(menuId);
  const { toggleShowAddInventoryModal, showAddInventory } = useInventory();

  return (
    <>
      <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl ">
        <HeaderTop
          title={`Inventory Manager ${menuName}`}
          description="Update Stocks "
        >
          <div
            className="border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-md"
            onClick={toggleShowAddInventoryModal}
          >
            Create Inventory

          </div>
        </HeaderTop>
        <hr className="mb-4" />
        <InventoryList inventories={inventories} isLoading={isLoading} deleteInventory={deleteInventory} currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  totalPages={totalPages} />
      </div>
      {showAddInventory && <InventoryAdd menuId={menuId} refreshInventories={refreshInventories} />}
    </>
  );
};

export default Inventory;
