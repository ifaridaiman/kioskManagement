"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateCustomerDetails } from "@/store/slice/orderSlice";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";

const CustomerDetail = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get existing customer details from Redux state
  const existingDetails = useSelector(
    (state: RootState) => state.order.customerDetails
  );

  // Local state to store form data
  const [customer, setCustomer] = useState<{
    name: string;
    address: string;
    phone: string;
    email: string;
    deliveryMethod: "pickup" | "delivery";
    paymentMethod: "cod" | "online";
  }>({
    name: "",
    address: "",
    phone: "",
    email: "",
    deliveryMethod: "delivery",
    paymentMethod: "cod",
  });

  // Fill form fields if existing details are available
  useEffect(() => {
    if (existingDetails) {
      setCustomer(existingDetails);
    }
  }, [existingDetails]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Dispatch update to Redux store
  const handleUpdateCustomerDetails = () => {
    dispatch(updateCustomerDetails(customer));
    
    router.push("/order/summary");
  };

  return (
    <div className="mt-4 h-screen px-4">
      <p className="font-semibold text-xl ">Customer Information</p>
      <Link
        href="/"
        className="text-sx flex gap-4 items-center"
      >
        <span>
          <BsArrowLeft />
        </span>
        Back to order page{" "}
      </Link>
      <div className="mt-6">
        {/* <p className="font-semibold text-base">Customer Information</p> */}
        
        <div className="mt-4">
          <div className="flex flex-col">
            <label>Name</label>
            <input
              name="name"
              className="border border-gray-400 rounded p-2 mt-2"
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-col">
            <label>Phone Number</label>
            <input
              name="phone"
              className="border border-gray-400 rounded p-2 mt-2"
              type="text"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-col">
            <label>Email</label>
            <input
              name="email"
              className="border border-gray-400 rounded p-2 mt-2"
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-col">
            <label>Address</label>
            <textarea
              name="address"
              className="border border-gray-400 rounded p-2 mt-2"
              placeholder="Enter Address"
              value={customer.address}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <hr className="border border-gray-400 w-full my-4" />
      </div>
      <div className="mt-6">
        <p className="font-semibold text-base">Delivery Method</p>
        <div className="mt-1">
          <div className="flex flex-col">
            <select
              name="deliveryMethod"
              className="border border-gray-400 rounded p-2 mt-2"
              value={customer.deliveryMethod}
              onChange={handleChange}
            >
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
            <select
              name="paymentMethod"
              className="border border-gray-400 rounded p-2 mt-2"
              value={customer.paymentMethod}
              onChange={handleChange}
            >
              <option value="cod">Cash</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          className="bg-primary text-white p-3 rounded-lg font-semibold w-full"
          onClick={handleUpdateCustomerDetails}
        >
          Save Customer Details
        </button>
      </div>
    </div>
  );
};

export default CustomerDetail;
