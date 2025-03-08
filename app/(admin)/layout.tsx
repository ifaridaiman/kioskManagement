"use client";
import React from "react";
import NavbarAdmin from "@/components/Navbar/NavbarAdmin";
import { MenuMakerProvider } from "./menu-editor/context/MenuMakerContext";
import { InventoryProvider } from "./inventory/[id]/context/InventoryProvider";
import { CategoryMakerProvider } from "./menu-editor/context/CategoryMakerContext";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <MenuMakerProvider>
      <CategoryMakerProvider>
      <InventoryProvider>
        <div className="bg-slate-50 h-screen">
          <NavbarAdmin />
          <div className="min-w-80 max-w-7xl mx-auto ">{children}</div>
        </div>
      </InventoryProvider>
      </CategoryMakerProvider>
    </MenuMakerProvider>
  );
};

export default layout;
