"use client";
import React from "react";

const CustomerDetail = () => {
  return (
    <>
      <div className="mt-4 h-screen px-4">
        <p className="font-semibold text-xl ">Back to ordering page</p>
        <div className="mt-6">
          <p className="font-semibold text-base">Customer Information</p>
          <div className="mt-4">
            <div className="flex flex-col">
              <label>Phone Number</label>
              <input
                className="border border-gray-400 rounded p-2 mt-2"
                type="text"
                placeholder="Phone Number"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col">
              <label>Name</label>
              <input
                className="border border-gray-400 rounded p-2 mt-2"
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col">
              <label>Address</label>
              <textarea
                className="border border-gray-400 rounded p-2 mt-2"
                placeholder="Phone Number"
              ></textarea>
            </div>
          </div>
          <hr className="border border-gray-400 w-full my-4" />
        </div>
        <div className="mt-6">
          <p className="font-semibold text-base">Delivery Method</p>
          <div className="mt-1">
            <div className="flex flex-col">
              <select className="border border-gray-400 rounded p-2 mt-2">
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>
          <hr className="border border-gray-400 w-full my-4" />
        </div>
        <div className="mt-6">
          <p className="font-semibold text-base">Payment Method</p>
          <div className="mt-1">
            <div className="flex flex-col">
              <select className="border border-gray-400 rounded p-2 mt-2">
                <option value="delivery">Cash</option>
                <option value="pickup">Online Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default CustomerDetail;
