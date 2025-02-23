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
    <div
      className=" rounded-xl shadow-lg flex flex-col justify-left items-left cursor-pointer relative"
      onClick={onClick}
    >
      <div className="w-full  relative">
        <Image
          className="w-full rounded-xl"
          src={"/assets/upload/menu/lemang-2.jpg"}
          height={200}
          width={200}
          alt={name}
        />
        <div className="absolute top-12 right-0 py-2 px-4  rounded-full bg-primary text-white">
          {/* <p className="text-base font-bold text-white">{price}</p> */}
          {count > 0 ? (
            `${count}`
          ) : (
            <GoPlusCircle className="w-6 h-6 text-primary" />
          )}
        </div>
      </div>
      <div className="p-4 text-left flex flex-col justify-between items-center">
        <p className="text-base font-bold">{name}</p>
        <p className="text-base font-bold">{price}</p>
      </div>
    </div>
  );
};

export default MenuCard;
