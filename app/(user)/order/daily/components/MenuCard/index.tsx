import Image from "next/image";
import React from "react";
import { GoPlusCircle } from "react-icons/go";

interface MenuCardProps {
  name: string;
  price: string;
  count: number;
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ name, price, count, onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        className=" rounded-xl flex flex-col justify-left items-left cursor-pointer relative"
      >
        <div className="w-full flex flex-row gap-4 items-center">
          <div>
            <Image
              className="w-20 h-20"
              src={"/assets/upload/menu/lemang-2.jpg"}
              height={80}
              width={80}
              alt={name}
            />
          </div>
          <div className="flex flex-col gap-2 p-4 w-full">
            <div className="flex flex-col gap-2">
              <p className="text-base font-bold">{name}</p>
              <p>8 stocks left</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base font-bold">{price}</p>
              <GoPlusCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-200" />
    </>
  );
};

export default MenuCard;
