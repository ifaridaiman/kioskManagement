"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
const NavbarCustomer = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (!menuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }
  };

  return (
    <div className={`sticky top-0 z-50 bg-white`}>
      <div
        className="flex justify-between items-center max-w-96 mx-auto  top-0 pl-2 px-4"
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

        {/* Hamburger Menu Button */}
        <button
          className="flex flex-col gap-1 cursor-pointer z-50"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-6 bg-current transition-transform ${
              menuOpen ? ` text-black rotate-45 translate-y-1.5` : ``
            }`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-current transition-opacity ${
              menuOpen ? "opacity-0" : ` `
            }`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-current transition-transform  ${
              menuOpen ? "-rotate-45 -translate-y-1.5 text-black" : ``
            }`}
          ></span>
        </button>

        {/* Full-Screen Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-start h-full gap-8">
            <div className="flex flex-col items-center h-full gap-8">
              <div className="flex flex-col items-center pt-36 h-full gap-8">
                <Image
                  className="block"
                  src={"/assets/logo/static/lemangtul_logo.svg"}
                  width={100}
                  height={100}
                  alt="LogoImage"
                />
                <div className="flex flex-col items-center gap-4">
                  <Link href="/" onClick={toggleMenu}>
                    <span className="text-3xl text-black font-bold">
                      NEW ORDER
                    </span>
                  </Link>
                  <Link
                    href="/order/status"
                    onClick={toggleMenu}
                    target="_blank"
                  >
                    <span className="text-3xl text-black font-bold">
                      ORDER STATUS
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarCustomer;
