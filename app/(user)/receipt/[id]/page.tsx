import React from "react";
import { Mrs_Saint_Delafield } from "next/font/google";
import Image from "next/image";
import NavbarCustomer from "@/components/Navbar/NavbarCustomer";

const mrsSaintDelafield = Mrs_Saint_Delafield({
  subsets: ["latin"], 
  weight: "400", // The font only supports 400
});

const ReceiptPage = () => {
  return (
    <>
      <NavbarCustomer />
      <div className="bg-primary min-h-[90vh] flex flex-col">
        <div className="flex flex-col justify-center items-center flex-grow md:my-4 rounded-md">
          <div className="flex flex-col items-center">
            <p className={`${mrsSaintDelafield.className} text-7xl text-white`}>Terima <span><br/></span> <span className="pl-8">Kasih</span></p>
            <p className="text-base text-white font-light">atas sokongan anda yang berterusan</p>
          </div>
          <div className="text-center mt-12">
            <p className="text-base text-slate-50 font-light capitalize">Tulus Ikhlas</p>
            <p className="text-base text-slate-50 font-light capitalize">Dari Lemangtul</p>
          </div>
          <div className="mt-20">
            <Image src="/assets/logo/static/lemangtul_logo_white.svg" alt="Lemangtul" width={100} height={100} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
