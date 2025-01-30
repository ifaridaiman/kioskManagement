"use client";
import React, { useState } from "react";
import MenuList from "./_components/MenuList";
import MenuAdd from "./_components/MenuAdd";
import { useMenuMaker } from "./context/MenuMakerContext";
import HeaderTop from "@/components/Header/Top";
import MenuUpdate from "./_components/MenuUpdate";

interface MenuMaker {
  title: string;
  price: number;
}

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
}

const MenuMaker = () => {
  const { toggleShowAddMenuModal, showAddMenu, showUpdateMenuModal } =
    useMenuMaker();

  // State to store selected menu for updating
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  // Function to handle edit button click
  const handleEditClick = (menu: MenuItem) => {
    setSelectedMenu(menu);
  };
  return (
    <>
      <div className="max-w-80 md:max-w-7xl mx-auto mt-10 bg-white rounded-xl ">
        <HeaderTop
          title="Menu Manager"
          description="Adding your menu and price "
        >
          <div
            className="border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-md"
            onClick={toggleShowAddMenuModal}
          >
            Add New Menu
          </div>
        </HeaderTop>
        <hr className="" />
        <MenuList onEditClick={handleEditClick} />
      </div>
      {showAddMenu && <MenuAdd />}
      {showUpdateMenuModal && selectedMenu && (
        <MenuUpdate
          id={selectedMenu.id}
          title={selectedMenu.title}
          description={selectedMenu.description}
          price={selectedMenu.price}
        />
      )}
    </>
  );
};

export default MenuMaker;
