"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const NavbarStaff = () => {
  

  return (
    <div className={`sticky top-0 z-50 bg-white`}>
      <div
        className="flex justify-between items-center max-w-96 mx-auto px-4 top-0"
        style={{ transition: "background-color 0.3s ease" }}
      >
        <Link href={"/"}>
          <Image
            className="block"
            src={"/assets/logo/static/lemangtul_logo.svg"}
            width={70}
            height={70}
            alt="LogoImage"
          />
        </Link>

        <UserButton />
      </div>
    </div>
  );
};

export default NavbarStaff;
