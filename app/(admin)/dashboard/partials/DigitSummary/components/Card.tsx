import React from "react";

interface CardProps {
  summaryTotal: number;
  summaryDescription: string;
}

const Card: React.FC<CardProps> = ({ summaryTotal, summaryDescription }) => {
  const formattedTotal = new Intl.NumberFormat("en-US").format(summaryTotal);
  return (
    <div className="flex flex-col justify-center items-center min-h-12 w-full gap-8 border-2 border-black rounded-xl p-4 bg-white">
      <p className="font-bold text-8xl">{formattedTotal}</p>
      <p>{summaryDescription}</p>
    </div>
  );
};

export default Card;
