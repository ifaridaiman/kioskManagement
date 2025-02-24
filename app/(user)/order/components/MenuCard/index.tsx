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
      
    >
      <div className="w-full  relative">
        <Image
          className="w-full rounded-t-xl"
          src={"/assets/upload/menu/lemang-2.jpg"}
          height={200}
          width={200}
          alt={name}
        />
        <div className="absolute top-2 right-2 py-2 px-4 rounded-lg bg-white bg-opacity-70 text-primary">
          <p className="text-base font-bold text-primary">{price}</p>
          {/* {count > 0 ? (
            `${count}`
          ) : (
            <GoPlusCircle className="w-6 h-6 text-primary" />
          )} */}
        </div>
      </div>
      <div className="p-4 text-left flex justify-between items-left " onClick={onClick}>
        <p className="text-base font-bold">{name}</p>
        {count > 0 ? (
          `${count}`
        ) : (
          <GoPlusCircle className="w-6 h-6 text-primary" />
        )}
      </div>
    </div>
  );
};

export default MenuCard;
