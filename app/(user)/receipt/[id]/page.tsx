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
  const [isValidId, setIsValidId] = useState<boolean | null>(false);

  useEffect(() => {
    console.log("Received ID:", id);
  }, [id]);
  
  useEffect(() => {
    if (!id || typeof id !== "string" || id === "failed") {
      setIsValidId(false);

      return;
    }else{
      setIsValidId(true)
    }

    
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
              <div className="text-center">
                <p className="text-5xl text-white font-semibold">Contact Us</p>
                <p className="text-base text-white font-light mt-2">
                  There was an issue with your order.
                </p>
                <p className="text-base text-white font-light mt-2">
                  Please contact support at 0162959474
                </p>
                <p className="text-base text-white font-light mt-2 mb-8">
                  or click this link
                </p>
                <a
                  className="text-xl text-black bg-white p-4 m-4 rounded"
                  href="https://wa.me/60162959474?text=I%20have%20issue%20with%20my%20Lemangtul%20order%2C%20please%20help%20me.
"
                  target="_blank"
                >
                  Report Link
                </a>
              </div>
            )}
          </div>
          {isValidId && (
            <div className="text-center mt-12">
              <p className="text-base text-slate-50 font-light capitalize">
                Tulus Ikhlas
              </p>
              <p className="text-base text-slate-50 font-light capitalize">
                Dari Lemangtul
              </p>
            </div>
          )}

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
