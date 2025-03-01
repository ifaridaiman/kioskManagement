"use client";
import React from "react";
import { useSelector } from "react-redux";
import MenuCard from "./MenuCard";
import { RootState } from "@/store/store";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stocks: number;
}

interface MenuContainerProps {
  slug: string;
  menus: MenuItem[];
}

const MenuContainer: React.FC<MenuContainerProps> = ({ slug, menus }) => {
  // Get orders from Redux state
  const orders = useSelector((state: RootState) => state.order.orders);

  return (
    <div>
      <p className="text-black font-bold text-xl">{slug}</p>

      {menus.map((item) => {
        // Find the order for the specific item
        const order = orders.find((order) => order.id === item.id);
        const count = order ? order.quantity : 0; // Default to 0 if item is not in the cart

        return (
          <MenuCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            stocks={item.stocks}
            quantity={count} // ✅ Pass quantity dynamically
          />
        );
      })}
    </div>
  );
};

export default MenuContainer;
