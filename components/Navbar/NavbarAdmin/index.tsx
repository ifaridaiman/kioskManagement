"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/menu-editor", label: "Menu Editor" },
  { href: "/order-list", label: "Order List" },
  { href: "/inventory", label: "Inventory" },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    {NAV_ITEMS.map((item) => (
      <Link key={item.href} href={item.href} onClick={onClick} className="text-4xl md:text-base text-black">
        {item.label}
      </Link>
    ))}
  </>
);

const HamburgerButton = ({ menuOpen, toggleMenu }: { menuOpen: boolean; toggleMenu: () => void }) => (
  <button className="md:hidden flex flex-col gap-1 cursor-pointer z-[99]" onClick={toggleMenu} aria-label="Toggle Menu">
    <span className={`h-0.5 w-6 bg-black transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
    <span className={`h-0.5 w-6 bg-black transition-opacity ${menuOpen ? "opacity-0" : ""}`}></span>
    <span className={`h-0.5 w-6 bg-black transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
  </button>
);

const NavbarAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="block z-50 shadow-sm bg-slate-50">
      <div className="flex justify-between items-center px-4 py-3">
        <Link href="/" className="font-bold text-xl">
          Kiosk Manager
        </Link>

        {/* Mobile Hamburger Button */}
        <HamburgerButton menuOpen={menuOpen} toggleMenu={toggleMenu} />

        {/* Mobile Full-Screen Menu */}
        <div className={`fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <NavLinks onClick={toggleMenu} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <NavLinks />
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
