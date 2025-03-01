"use client";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";
import React from "react";
import TotalButton from "./order/customer-detail/components/TotalButton";
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    
        <div className="bg-slate-50 h-screen">
          <NavbarCustomer />
          <div className="min-w-80 max-w-96 mx-auto h-full ">{children}</div>
          <TotalButton />
        </div>
  );
};

export default layout;
