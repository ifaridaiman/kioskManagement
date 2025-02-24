"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import FullPageLoader from "@/components/Loader/FullPageLoader";
import OrderTypeCard from "./_components/OrderTypeCard";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setTimeout(() => {
        const newUserId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem("user_id", newUserId);
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="max-w-80 mx-auto flex flex-col justify-between h-screen">
      <div className="flex flex-col justify-center items-center p-4">
        {/* logo */}
        <div className="flex flex-col justify-center items-center">
          <Image
            src={"/assets/logo/static/lemangtul_logo.svg"}
            height={100}
            width={100}
            alt="LE-MANGTUL"
          />
          <div className="mt-5">
            <p className="font-bold text-2xl">Choose your order type</p>
            <p className="font-medium text-lg">
              Daily or catering, we tapaw semua
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8 min-w-80">
          <OrderTypeCard />
          <OrderTypeCard />
          <OrderTypeCard />
        </div>
      </div>

      <div className="text-center p-2">
        <p className="text-xs text-gray-500">Developed by Naisu Technology</p>
      </div>
    </div>
  );
}
