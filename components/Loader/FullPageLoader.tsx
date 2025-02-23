import React from 'react'
import Image from 'next/image'

const FullPageLoader = () => {
  return (
    <div className='bg-primary h-screen flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 z-50'>
      <Image className='animate-bounce-fade' src='/assets/logo/static/lemangtul_logo_white.svg' height={200} width={200} alt='LE-MANGTUL' />
    </div>
  )
}

export default FullPageLoader