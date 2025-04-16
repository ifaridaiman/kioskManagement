"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateCustomerDetails } from "@/store/slice/orderSlice";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define validation schema using Zod
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  remarks: z.string().optional().default(""),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["cod", "online"]),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const CustomerDetail: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const existingDetails = useSelector(
    (state: RootState) => state.order.customerDetails
  );

  const orderCount = useSelector(
    (state: RootState) => state.order.orders.length
  );

  useEffect(() => {
    if (orderCount === 0) {
      router.push("/");
    }
  }, [orderCount, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      remarks: "",
      deliveryMethod: "pickup",
      paymentMethod: "online",
    },
  });

  useEffect(() => {
    if (existingDetails) {
      Object.entries(existingDetails).forEach(([key, value]) => {
        setValue(key as keyof CustomerFormData, value as string);
      });
    }
  }, [existingDetails, setValue]);

  const onSubmit = (data: CustomerFormData) => {

    const sanitizedData = {
      ...data,
      phone: data.phone.replace(/[-\s]/g, ""), // Removes dashes and spaces
    };
  
    dispatch(updateCustomerDetails(sanitizedData));
    router.push("/order/summary");
  };

  return (
    <div className="mt-4 h-screen px-4">
      <p className="font-semibold text-xl">Customer Information</p>
      <Link href="/" className="text-sx flex gap-4 items-center">
        <BsArrowLeft /> Back to order page
      </Link>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="mt-4 flex flex-col">
          <label>Name</label>
          <input
            {...register("name")}
            className="border border-gray-400 rounded p-2 mt-2"
            placeholder="Full Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mt-4 flex flex-col">
          <label>Phone Number</label>
          <input
            {...register("phone")}
            className="border border-gray-400 rounded p-2 mt-2"
            placeholder="Phone Number"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div className="mt-4 flex flex-col">
          <label>Email</label>
          <input
            {...register("email")}
            className="border border-gray-400 rounded p-2 mt-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mt-4 flex flex-col">
          <label>Address</label>
          <textarea
            {...register("address")}
            className="border border-gray-400 rounded p-2 mt-2"
            placeholder="Enter Address"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div className="mt-4 flex-col flex">
          <label>Remarks</label>
          <textarea
            {...register("remarks")}
            className="border border-gray-400 rounded p-2 mt-2"
            placeholder="Remarks (optional)"
          />
        </div>

        <hr className="border border-gray-400 w-full my-4" />

        <div className="mt-6 flex flex-col">
          <label>Delivery Method</label>
          <select
            {...register("deliveryMethod")}
            className="border border-gray-400 rounded p-2 mt-2"
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <hr className="border border-gray-400 w-full my-4" />

        <div className="mt-6 flex flex-col">
          <label>Payment Method</label>
          <select
            {...register("paymentMethod")}
            className="border border-gray-400 rounded p-2 mt-2"
          >
            <option value="online">Online Payment</option>
            {/* <option value="cod">Cash</option> */}
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-lg font-semibold w-full"
          >
            Save Customer Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetail;
