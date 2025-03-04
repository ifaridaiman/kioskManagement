"use client";
import React from "react";
import Link from "next/link";
import { CiDeliveryTruck } from "react-icons/ci";
import { BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SummaryPage = () => {
  const { orders, customerDetails } = useSelector(
    (state: RootState) => state.order
  );
  return (
    <div className="mt-4 h-screen px-4">
      <p className="font-semibold text-xl ">Summary</p>
      <Link
        href="/order/customer-detail"
        className="text-sx flex gap-4 items-center"
      >
        <span>
          <BsArrowLeft />
        </span>
        Back to customer detail page{" "}
      </Link>
      <div className="mt-6">
        <p className="font-semibold text-base mb-4">Order Summary</p>
        {/* <div className="mt-4 border border-gray-400 rounded-md">
          <div className="flex justify-between items-center  p-4">
            <div className="flex  gap-8 items-center">
              <div className="border border-primary rounded-md flex justify-center items-center w-8 h-8 p-2">
                <p className="text-primary font-bold">1x</p>
              </div>
              <div>
                <p className="font-semibold text-primary">Lemang XL</p>
                <p className="text-gray-400">Edit</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-primary">RM 2.50</p>
            </div>
          </div>
        </div> */}
        {orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className=" border border-gray-400 rounded-md"
              >
                <div className="flex justify-between items-center p-4 border-b last:border-none">
                  <div className="flex gap-8 items-center">
                    <div className="border border-primary rounded-md flex justify-center items-center w-8 h-8 p-2">
                      <p className="text-primary font-bold">
                        {order.quantity}x
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{order.name}</p>
                      <p className="text-gray-400">Edit</p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">
                    RM {order.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No orders placed.</p>
        )}
        <hr className="border border-gray-400 w-full my-4" />
      </div>
      <div className="mt-6">
        <p className="font-semibold text-base">Delivery Summary</p>
        <div className="mt-4 border border-gray-400 bg-primary rounded-md">
          <div className="flex justify-between items-center  p-4">
            <div className="flex gap-4 items-center">
              <div className="border border-primary rounded-md flex justify-center items-center w-16 h-16 p-2">
                <CiDeliveryTruck className="text-white text-5xl" />
              </div>
              <div>
                <p className="font-light text-white">
                  {customerDetails?.deliveryMethod === "pickup"
                    ? "Customer will pick up the order."
                    : "Customer needs to arrange their own delivery method."}
                </p>
                <p className="text-gray-50 font-semibold underline">
                  Copy our Address
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr className="border border-gray-400 w-full my-4" />
      </div>
      <div className="mt-6">
        <p className="font-semibold text-base">Payment Summary</p>
        <div className="mt-4 border border-gray-400 rounded-md">
          <div className="flex justify-between items-center  p-4">
            <div className="flex justify-between items-center w-full">
              {/* <p className="font-semibold text-primary">
                Pay by Online Payment
              </p> */}
              <p className="font-semibold text-primary">
                Pay by{" "}
                {customerDetails?.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>
              <p className="text-gray-400">Edit</p>
            </div>
          </div>
        </div>
        {/* <hr className="border border-gray-400 w-full my-4" /> */}
      </div>
    </div>
  );
};

export default SummaryPage;
