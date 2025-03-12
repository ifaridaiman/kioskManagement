"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MenuCard from "./MenuCard";
import { RootState } from "@/store/store";
import { MenuCategory, MenuItem } from "@/types/menuCategory";

interface MenuContainerProps {
  typeId: string;
  menus: MenuCategory[];
}

const MenuContainer: React.FC<MenuContainerProps> = ({ menus, typeId }) => {
  // Get orders from Redux state
  const orders = useSelector((state: RootState) => state.order.orders);

  useEffect(() => {
    console.log("MenuContainer Orders:", menus);
  }, [menus]);

  return (
    <div key={typeId}>
      {menus.map((item) => {

        console.log("MenuContainer Item:", item);
        // const order = orders.find((order) => order.id === item.id);
        // const count = order ? order.quantity : 0; // Default to 0 if item is not in the cart
        return (
          <div key={item.id} className="mb-8">
            <p className="text-black font-bold text-xl">{item.title}</p>
            {item.menus.map((menu: MenuItem) => (
              <MenuCard
                key={menu.id}
                id={menu.id}
                name={menu.title} // ✅ API uses "title"
                price={parseFloat(menu.price)}
                stocks={menu.inventory?.[0]?.quantity || 0}
                quantity={
                  orders.find((order) => order.id === menu.id)?.quantity || 0
                }
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MenuContainer;
