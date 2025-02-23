'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import CardCart from './components/CardCart';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Lemang XL', price: 2.50, quantity: 1 },
    { id: 2, name: 'Lemang M', price: 1.50, quantity: 2 },
    { id: 3, name: 'Lemang M', price: 1.50, quantity: 3 },
    { id: 4, name: 'Lemang M', price: 1.50, quantity: 4 },
  ]);

  const handleAdd = (id: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleReduce = (id: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="max-w-80 mx-auto flex flex-col justify-between h-screen">
      <div className="flex justify-center items-center p-4">
        {/* logo */}
        <Image
          className=""
          src={"/assets/logo/static/lemangtul_logo.svg"}
          height={100}
          width={100}
          alt="LE-MANGTUL"
        />
      </div>
      <div className="flex flex-col justify-top items-top gap-4">
        {/* Cart */}
        <div className="p-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          {cartItems.map(item => (
            <CardCart
              key={item.id}
              item={item}
              handleAdd={handleAdd}
              handleReduce={handleReduce} />
          ))}
          <div className="flex justify-between items-center border-t py-2 mt-4">
            <p className="text-lg font-bold">Total:</p>
            <p className="text-lg font-bold">{getTotal()} RM</p>
          </div>
        </div>
      </div>
      <div>
        <button className="bg-green-500 text-white w-full py-2">Make Payment</button>
      </div>
      <div className="text-center p-2">
        <p className="text-xs text-gray-500">Developed by Naisu Technology</p>
      </div>
    </div>
  );
};

export default CartPage;