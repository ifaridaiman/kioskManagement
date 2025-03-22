"use client";
import React, { useState } from "react";
import MenuList from "./_components/MenuList";
import MenuAdd from "./_components/MenuAdd";
import { useMenuMaker } from "./context/MenuMakerContext";
import HeaderTop from "@/components/Header/Top";
import MenuUpdate from "./_components/MenuUpdate";
import { useCategoryMaker } from "./context/CategoryMakerContext";
import CategoryAdd from "./_components/CategoryAdd";
import MenuUploadImage from "./_components/MenuUploadImage";

interface MenuMaker {
  title: string;
  price: number;
}

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
}

const MenuMaker = () => {
  const { toggleShowAddMenuModal, showAddMenu, showUpdateMenuModal, showUploadMenuModal, handleClickShowUpload } =
    useMenuMaker();
  const {
    toggleShowAddCategoryModal,
    showAddCategory,
    // showUpdateCategoryModal,
  } = useCategoryMaker();

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
          <div className="flex space-x-4 md:justify-end">
            <div
              className="w-fit border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-md text-sm md:text-base"
              onClick={toggleShowAddCategoryModal}
            >
              Add New Category
            </div>
            <div
              className="w-fit border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-md text-sm md:text-base"
              onClick={toggleShowAddMenuModal}
            >
              Add New Menu
            </div>
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
      {showAddCategory && <CategoryAdd />}
      {showUploadMenuModal && selectedMenu  &&  <MenuUploadImage menuId={selectedMenu.id} menuTitle={selectedMenu.title} toggleShowUpdateMenuModal={handleClickShowUpload}/> }
    </>
  );
};

export default MenuMaker;
