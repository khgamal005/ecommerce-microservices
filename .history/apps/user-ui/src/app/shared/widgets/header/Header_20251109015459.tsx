import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-fill h-16 bg-white ">
        <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
            <div>
                <Link href="/">
                <span className='text-xl font-600'>Easy Shop</span>
                </Link>
            </div>
            <div className='w-[50%] relative'>
                <input type="text" className='w-full px-4 font-poppins border-[2.5px]  border-[#3489FF] rounded-md outline-none h-[55px]' placeholder='Search...' />
                <
            </div>


        </div>
    </div>
  )
}

export default Header