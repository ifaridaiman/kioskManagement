import React from "react";

interface StatusCardProps {
    status: string;
    description: string;
}

const StatusCard:React.FC<StatusCardProps> = ({status, description}) => {
  return (
    <div className="flex gap-4 ">
      <div className="rounded-full bg-black w-5 h-5 p-4"></div>
      <div>
        <p className="text-base font-bold text-gray-900">{status}</p>
        <p className="text-sm font-medium text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StatusCard;
