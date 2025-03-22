"use client";

import React from "react";
import { MenuItem } from "@/utils/fetchMenus";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { useMenuMaker } from "../../context/MenuMakerContext";
import { useMenuList } from "./hooks/useMenuList";
import { CiBoxList, CiCamera } from "react-icons/ci";
import Link from "next/link";

interface MenuListProps {
  onEditClick: (menu: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({ onEditClick }) => {
  const { handleClickShowUpdate, handleClickShowUpload } = useMenuMaker();
  const {
    menus,
    isLoading,
    page,
    title,
    setTitle,
    handleNextPage,
    handlePrevPage,
    deleteMenu,
  } = useMenuList();

  return (
    <div className="pb-8">
      <div className="mb-4 p-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-md w-full"
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full w-full rounded-tl-md">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="py-2 text-left px-4  text-gray-500 font-semibold">
                Name
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Description
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Price
              </th>
              <th className="py-2 text-left px-4 text-gray-500 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <p>Loading menus...</p>
                </td>
              </tr>
            ) : menus.length > 0 ? (
              menus.map((menu) => (
                <tr key={menu.id}>
                  <td className="px-4 py-2">{menu.title}</td>
                  <td className="px-4 py-2">{menu.description}</td>
                  <td className="px-4 py-2">{menu.price}</td>
                  <td className="px-4 py-2 flex flex-row gap-4">
                    <button
                      onClick={() => {
                        onEditClick(menu);
                        handleClickShowUpdate();
                      }}
                    >
                      <LuPencilLine />
                    </button>
                    <Link href={`/inventory/${menu.id}`} title="Inventory List">
                      <CiBoxList />
                    </Link>
                    <button
                      onClick={() => {
                        onEditClick(menu);
                        handleClickShowUpload();
                      }}
                      title="Upload Image"
                    >
                      <CiCamera />
                    </button>
                    <button onClick={() => deleteMenu(menu.id)} title="">
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
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 px-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MenuList;
