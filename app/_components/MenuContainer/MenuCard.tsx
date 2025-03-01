'use client'
import Image from "next/image";
import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import { BiMinus } from "react-icons/bi";

interface MenuCardProps {
  name: string;
  price: string;
  count: number;
  stocks: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, price, count = 0, stocks = 0 }) => {
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      {/* Menu Card */}
      <div
        onClick={() => setOpenDetail(true)}
        className="rounded-xl flex flex-col cursor-pointer relative"
      >
        <div className="w-full flex flex-row gap-4 items-center">
          <div>
            <Image
              className="w-20 h-20 rounded-lg"
              src={"/assets/upload/menu/lemang-2.jpg"}
              height={80}
              width={80}
              alt={name}
            />
          </div>
          <div className="flex flex-col gap-2 p-4 w-full">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold">{name}</p>
              {stocks > 0 ? (
                <p className="text-sm text-gray-500">Stocks: {stocks}</p>
              ) : (
                <p className="text-sm text-red-500">Out of stock</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base font-bold">{price}</p>
              {
                count > 0 ? (
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <BiMinus className="w-6 h-6 text-gray-600" />
                    <span className="px-4">{count}</span>
                    <GoPlusCircle className="w-6 h-6 text-primary" />
                  </div>
                ) :(
                  <GoPlusCircle className="w-6 h-6 text-primary" />
                )
              }
              
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-gray-200" />

      {/* Menu Detail Modal */}
      {openDetail && <MenuDetail name={name} price={price} onClose={() => setOpenDetail(false)} imageUrl="/assets/upload/menu/lemang-2.jpg" description="With average 8-10cm for each lemang." />}
    </>
  );
};

interface MenuDetailProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  onClose: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({ name, description, price, imageUrl, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  // Handle quantity changes
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50">
      {/* Top Section - Image & Back Button */}
      <div className="relative">
        <button className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md" onClick={onClose}>
          <IoChevronBack className="w-6 h-6 text-gray-600" />
        </button>
        <Image src={imageUrl} height={400} width={600} alt={name} className="w-full h-60 object-cover" />
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-6">
        <p className="text-lg font-bold">{name}</p>
        <p className="text-gray-600 mt-1">{description}</p>

        {/* Price and Quantity Selector */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-green-700 font-semibold text-lg">{price}</p>
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <button onClick={decreaseQuantity} className="p-2">
              <BiMinus className="w-6 h-6 text-gray-600" />
            </button>
            <span className="px-4">{quantity}</span>
            <button onClick={increaseQuantity} className="p-2">
              <GoPlusCircle className="w-6 h-6 text-green-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Add to Basket Button */}
      <div className="p-6 mt-auto">
        <button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg">
          Add in the basket
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
