"use client";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";
import React from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    
        <div className="bg-slate-50 h-screen">
          <NavbarCustomer />
          <div className="min-w-80 max-w-96 mx-auto ">{children}</div>
        </div>
  );
};

export default layout;
