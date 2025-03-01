'use client'
import React from 'react'

interface TotalButtonProps {
    total: number;
}

const TotalButton:React.FC<TotalButtonProps> = ({total}) => {
  return (
    <div className='sticky left-0 bottom-0 w-full h-full bg-white'>
        <div className='flex justify-between p-4'>
            <p>Total</p>
            <p>{total}</p>
        </div>
        <div className='px-4'>
            <button className='w-full bg-primary text-white p-4'>Place Order</button>
        </div>
    </div>
  )
}

export default TotalButton