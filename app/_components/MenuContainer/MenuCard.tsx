"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, removeOrder, updateQuantity } from "@/store/slice/orderSlice";
import { IoChevronBack } from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import { BiMinus } from "react-icons/bi";
import { RootState } from "@/store/store";

interface MenuCardProps {
  id: string;
  name: string;
  price: number;
  stocks: number;
  quantity: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ id, name, price, stocks }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.orders.find((order) => order.id === id));

  const count = order ? order.quantity : 0;

  return (
    <>
      {/* Menu Card */}
      <div
        onClick={() => stocks > 0 && setOpenDetail(true)} // Prevent opening if stock is 0
        className="rounded-xl flex flex-col cursor-pointer relative"
      >
        <div className="w-full flex flex-row gap-4 items-center">
          <div>
            <Image className="w-20 h-20 rounded-lg" src={"/assets/upload/menu/lemang-2.jpg"} height={80} width={80} alt={name} />
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
              <p className="text-base font-bold">RM {price.toFixed(2)}</p>
              {count > 0 ? (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button onClick={() => dispatch(updateQuantity({ id, quantity: count - 1 }))}>
                    <BiMinus className="w-6 h-6 text-gray-600" />
                  </button>
                  <span className="px-4">{count}</span>
                  <button onClick={() => dispatch(updateQuantity({ id, quantity: count + 1 }))}>
                    <GoPlusCircle className="w-6 h-6 text-primary" />
                  </button>
                </div>
              ) : (
                <GoPlusCircle
                  className="w-6 h-6 text-primary"
                  onClick={() =>
                    dispatch(addOrder({ id, name, price, quantity: 1 }))
                  }
                />
              )}
            </div>
          </div>
        </div>
        {stocks === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl cursor-not-allowed"></div>
        )}
      </div>

      {/* Separator */}
      <hr className="border-gray-200" />

      {/* Menu Detail Modal */}
      {openDetail && (
        <MenuDetail
          id={id}  // ✅ Passing `id` directly
          name={name}
          price={price}
          stocks={stocks}
          onClose={() => setOpenDetail(false)}
          imageUrl="/assets/upload/menu/lemang-2.jpg"
          description="With average 8-10cm for each lemang."
        />
      )}
    </>
  );
};

interface MenuDetailProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stocks: number;
  onClose: () => void;
}

const MenuDetail: React.FC<MenuDetailProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  stocks,
  onClose,
}) => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.orders.find((order) => order.id === id));

  const count = order ? order.quantity : 0;

  const increaseQuantity = () => {
    if (count < stocks) {
      if(count === 0) {
        dispatch(addOrder({ id, name, price, quantity: 1 }));
      }else{
        dispatch(updateQuantity({ id, quantity: count + 1 }));
      }
      
    }
  };

  const decreaseQuantity = () => {
    if (count > 1) {
      dispatch(updateQuantity({ id, quantity: count - 1 }));
    } else {
      dispatch(removeOrder(id));
    }
  };

  const handleAddToBasket = () => {
  
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50 md:max-w-96 md:mx-auto">
      {/* Top Section - Image & Back Button */}
      <div className="relative">
        <button
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
          onClick={onClose}
        >
          <IoChevronBack className="w-6 h-6 text-gray-600" />
        </button>
        <Image
          src={imageUrl}
          height={400}
          width={600}
          alt={name}
          className="w-full h-60 object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-6">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">{name}</p>
          {stocks > 0 ? (
            <p className="text-sm text-gray-500">Stocks: {stocks}</p>
          ) : (
            <p className="text-sm text-red-500">Out of stock</p>
          )}
        </div>

        <p className="text-gray-600 mt-1">{description}</p>

        {/* Price and Quantity Selector */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-green-700 font-semibold text-lg">RM {price.toFixed(2)}</p>
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <button onClick={decreaseQuantity} className="p-2">
              <BiMinus className="w-6 h-6 text-gray-600" />
            </button>
            <span className="px-4">{count}</span>
            <button onClick={increaseQuantity} className="p-2">
              <GoPlusCircle className="w-6 h-6 text-green-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Add to Basket Button */}
      <div className="p-6 mt-auto">
        <button
          onClick={handleAddToBasket}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg"
        >
          {count > 0 ? "Update in Basket" : "Add to Basket"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
