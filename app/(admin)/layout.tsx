"use client";
import React from "react";
import NavbarAdmin from "@/components/Navbar/NavbarAdmin";
import { MenuMakerProvider } from "./menu-editor/context/MenuMakerContext";
import { InventoryProvider } from "./inventory/[id]/context/InventoryProvider";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <MenuMakerProvider>
      <InventoryProvider>
        <div className="bg-slate-100 h-screen">
          <NavbarAdmin />
          <div className="min-w-80 max-w-7xl mx-auto ">{children}</div>
        </div>
      </InventoryProvider>
    </MenuMakerProvider>
  );
};

export default layout;
