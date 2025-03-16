"use client";
import React from "react";
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

  


  return (
    <div key={typeId}>
      {menus.map((item) => {

        // const order = orders.find((order) => order.id === item.id);
        // const count = order ? order.quantity : 0; // Default to 0 if item is not in the cart
        return (
          <div key={item.id} className="mb-8">
            <p className="text-black font-bold text-xl">{item.title}</p>
            {item.menus.map((menu: MenuItem) => {
              
                const imageUrl = item.title === "Lemang"
                ? "/assets/upload/menu/lemangs.jpeg"
                : item.title === "Rendang"
                ? menu.title.includes("ayam")
                ? "/assets/upload/menu/rendang-ayam.jpg"
                : "/assets/upload/menu/rendang-daging.jpg"
                : item.title === "Savoury"
                ? "/assets/upload/menu/kuah-kacang.jpg"
                : item.title === "Serunding"
                ? "/assets/upload/menu/chicken-floss.jpg"
                : "/assets/upload/menu/noImage.jpeg";
              return(
              <MenuCard
                key={menu.id}
                id={menu.id}
                name={menu.title} // ✅ API uses "title"
                price={parseFloat(menu.price)}
                stocks={menu.inventory?.[0]?.quantity || 0}
                quantity={
                  orders.find((order) => order.id === menu.id)?.quantity || 0
                }
                imageUrl={menu.image_url || imageUrl}
                description={menu.description}
                category={item.title}
                inventoryId={menu.inventory[0].inventory_id || ""}
              />
            )})}
          </div>
        );
      })}
    </div>
  );
};

export default MenuContainer;
