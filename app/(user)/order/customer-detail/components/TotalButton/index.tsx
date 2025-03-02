"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

const TotalButton: React.FC = () => {
  // Get total RM price from Redux
  const totalPrice = useSelector((state: RootState) =>
    state.order.orders.reduce((total, order) => total + order.price * order.quantity, 0)
  );

  return (
    <div className="sticky bottom-0 z-10 bg-white w-full border-t px-4 py-4">
      <div className="flex justify-between p-4">
        <p className="font-bold text-lg">Total</p>
        <p className="font-bold text-lg">RM {totalPrice.toFixed(2)}</p>
      </div>
      <div className="px-4">
        <Link
          href={'/order/summary'}
          className="block w-full text-center bg-primary text-white py-4 rounded-lg font-semibold"
        >
          Place Order
        </Link>
      </div>
    </div>
  );
};

export default TotalButton;
