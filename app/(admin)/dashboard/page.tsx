import React from "react";
import CollectionList from "./partials/CollectionList";


const Dashboard = () => {
  return (
    <div className="pt-10 px-8">
      {/* <DigitSummary/> */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-800 font-semibold">Dashboard</h1>
      </div>
      <CollectionList/>
      <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-base text-gray-500 font-semibold">Total order </p>
          <p className="text-sm text-gray-500 font-light">Description</p>
          <p className="text-3xl text-gray-800 font-bold mt-4">30</p>
        </div>
        <div>
          <p className="text-base text-gray-500 font-semibold">Total order </p>
          <p className="text-sm text-gray-500 font-light">Description</p>
          <p className="text-3xl text-gray-800 font-bold mt-4">30</p>
        </div>
        <div>
          <p className="text-base text-gray-500 font-semibold">Total order </p>
          <p className="text-sm text-gray-500 font-light">Description</p>
          <p className="text-3xl text-gray-800 font-bold mt-4">30</p>
        </div>
        <div>
          <p className="text-base text-gray-500 font-semibold">Total order </p>
          <p className="text-sm text-gray-500 font-light">Description</p>
          <p className="text-3xl text-gray-800 font-bold mt-4">30</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <p className="text-gray-800 text-base font-semibold">Lemang Produced</p>
          <div></div>
        </div>
        <div className="border border-slate-200 rounded p-4 shadow-md shadow-slate-100">
          <p className="text-gray-800 text-base font-semibold">Lemang Sold</p>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800 text-base font-semibold">Customer Name</p>
              <p className="text-gray-800 text-base font-light">Pickup/Delivery Date</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800 text-base font-semibold">Customer Name</p>
              <p className="text-gray-800 text-base font-light">Pickup/Delivery Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
