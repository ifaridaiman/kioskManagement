import React from 'react'

const OrderListPage = () => {
  return (
    <div>
      <div>
        <button>All</button>
        <button>Ready</button>
        <button>Completed</button>
      </div>
      <div>
        <input type='text' />
        <p>10 Order Left</p>
        <div>
          <p><span>{'LMG-001'}</span>-<span>{'Arif Lukman'}</span></p>
          <p>3 Items</p>
          <div className='grid grid-cols-2 bg-slate-300 py-2'>
            {/* order Item */}
            <p></p>
            {/* order Qty */}
            <p></p>
          </div>
          <div className='flex justify-between'>
            <div>Ready To Pickup</div>
            <button>Update Status</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderListPage