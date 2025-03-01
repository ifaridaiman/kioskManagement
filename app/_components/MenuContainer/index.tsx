import React from "react";
import MenuCard from "./MenuCard";
interface MenuItem {
  name: string;
  price: number;
}

interface MenuContainerProps {
  slug: string;
  menus: MenuItem[];
}

const MenuContainer: React.FC<MenuContainerProps> = ({ slug, menus }) => {
  return (
    <div>
      <p className="text-black font-bold text-xl">{slug}</p>

      {menus.map((item) => {
        return (
          <MenuCard
            key={item.name}
            name={item.name}
            price={`RM ${item.price.toFixed(2)}`}
            count={5}
            stocks={10}
            
          />
        );
      })}

      {/* {menus.map((item) => {
              return (
                <MenuCard
                  key={item.name}
                  name={item.name}
                  price={`RM ${item.price.toFixed(2)}`}
                  // onClick={() => handleCardClick(item.name)}
                  count={counts[item.name] || 0}\
                  stocks={10}
                />
              );
            })} */}
    </div>
  );
};

export default MenuContainer;
