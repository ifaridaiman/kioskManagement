/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

interface StatusCardProps {
  status: string;
  description: string;
  order: any[];
  orderId: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  description,
  order,
  orderId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className="border border-gray-200 bg-white shadow-lg rounded-md py-2 px-4"
      onClick={toggleCollapse}
    >
      <div className="flex justify-between items-center gap-4 cursor-pointer">
        <div className="flex gap-4">
          <div>
            <p className="text-base font-bold text-gray-900">{orderId}</p>
            <p className="text-sm font-light text-gray-400">{description}</p>
          </div>
        </div>
        <div>
          {isCollapsed ? (
            <svg
              className="w-6 h-6 text-gray-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-500 rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
          )}
        </div>
      </div>
      {isCollapsed && (
        <div className="mt-4">
          <p className="font-bold text-sm">{status}</p>
          {order.map((item: any, idx: number) => (
            <div key={idx} className="text-gray-600 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-semibold">
                    {item.menu.title}
                  </p>
                  <p className="text-gray-600 text-xs ">RM {item.menu.price}</p>
                </div>
                <p>x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusCard;
