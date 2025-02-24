import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LuClock3 } from "react-icons/lu";
const OrderTypeCard = () => {
  return (
    <Link
      href={"/order/daily"}
      className="w-full bg-white rounded-lg border border-gray-300 flex gap-4"
    >
      <div className="w-28 h-28">
        <Image
          className="w-full h-full rounded-l-lg"
          src={"/assets/upload/menu/lemang-2.jpg"}
          height={150}
          width={120}
          alt="Daily"
        />
      </div>
      <div className="flex flex-col justify-center items-start gap-1">
        <p className="text-2xl font-bold">Daily</p>
        <p className="text-base text-gray-500 font-light flex gap-2 justify-center items-center">
          <LuClock3 /> Order before 3pm
        </p>
        <p className="text-base font-light hover:font-bold text-primary">
          Order Now
        </p>
      </div>
    </Link>
  );
};

export default OrderTypeCard;
