import React from 'react'
import Image from 'next/image'

const Loading = () => {
  return (
    <div className='bg-primary h-screen flex justify-center items-center'>
      <Image className='animate-bounce-fade' src='/assets/logo/static/lemangtul_logo_white.svg' height={200} width={200} alt='LE-MANGTUL' />
    </div>
  )
}

export default Loading