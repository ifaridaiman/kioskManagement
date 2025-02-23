import React from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CardCartProps {
  item: CartItem;
  handleAdd: (id: number) => void;
  handleReduce: (id: number) => void;
}

const CardCart: React.FC<CardCartProps> = ({
  item,
  handleAdd,
  handleReduce,
}) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div className="bg-black p-5">{/* image */}</div>
      <div>
        <p className="text-lg font-bold">{item.name}</p>
        <p className="text-base">RM {(item.price * item.quantity).toFixed(2)} </p>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={() => handleReduce(item.id)}
          className="px-2 py-1 bg-red-500 text-white"
        >
          -
        </button>
        <p className="px-4">{item.quantity}</p>
        <button
          onClick={() => handleAdd(item.id)}
          className="px-2 py-1 bg-green-500 text-white"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CardCart;
