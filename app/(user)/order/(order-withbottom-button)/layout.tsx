"use client";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";
import React from "react";
import TotalButton from "../customer-detail/components/TotalButton";
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="bg-slate-50 h-auto">
        <NavbarCustomer />
        <div className="min-w-80 max-w-96 mx-auto h-full mb-32">{children}</div>
      </div>
      <TotalButton />
    </>
  );
};

export default layout;
