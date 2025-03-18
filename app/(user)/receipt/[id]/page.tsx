"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mrs_Saint_Delafield } from "next/font/google";
import Image from "next/image";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";

const mrsSaintDelafield = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400", // The font only supports 400
});

const ReceiptPage = () => {
  const { id } = useParams(); // Extract ID from URL
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string" || id === "failed") {
      setIsValidId(false);
      setErrorMessage("Invalid order ID. Please contact support.");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: id }),
        });

        const data = await response.json();

        if (!response.ok || data.status === "failed") {
          throw new Error(data.message || "Order not found");
        }

        setIsValidId(true);
      } catch (error) {
        setIsValidId(false);
        setErrorMessage((error as Error).message);
      }
    };

    fetchOrderStatus();
  }, [id]);

  return (
    <>
      <NavbarCustomer />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="flex flex-col justify-center items-center flex-grow md:my-4 rounded-md">
          <div className="flex flex-col items-center">
            {isValidId === null ? (
              <p className="text-xl text-white">Loading...</p>
            ) : isValidId ? (
              <>
                <p
                  className={`${mrsSaintDelafield.className} text-7xl text-white`}
                >
                  Terima{" "}
                  <span>
                    <br />
                  </span>{" "}
                  <span className="pl-8">Kasih</span>
                </p>
                <p className="text-base text-white font-light">
                  atas sokongan anda yang berterusan
                </p>
              </>
            ) : (
              <>
                <p className="text-5xl text-white font-semibold">Contact Us</p>
                <p className="text-base text-white font-light mt-2">
                  {errorMessage || "There was an issue with your order. Please contact us for assistance."}
                </p>
              </>
            )}
          </div>
          <div className="text-center mt-12">
            <p className="text-base text-slate-50 font-light capitalize">
              Tulus Ikhlas
            </p>
            <p className="text-base text-slate-50 font-light capitalize">
              Dari Lemangtul
            </p>
          </div>
          <div className="mt-20">
            <Image
              src="/assets/logo/static/lemangtul_logo_white.svg"
              alt="Lemangtul"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
