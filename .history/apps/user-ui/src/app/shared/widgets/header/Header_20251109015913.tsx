import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-full h-16 bg-white">
      <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div>
          <Link href="/">
            <span className="text-xl font-semibold">Easy Shop</span>
          </Link>
        </div>

        {/* Search Box */}
        <div className="w-[50%] relative">
          <input
            type="text"
            className="w-full px-4 font-poppins border-2.5 border-[#3489FF] rounded-md outline-none h-[55px]"
            placeholder="Search..."
          />

          {/* Search Icon Button */}
          <div className="w-10 h-10 bg-[#3489FF] rounded-md absolute top-1/2 -translate-y-1/2 right-1 flex items-center justify-center cursor-pointer">
            <search size={20} strokeWidth={2.5} className="text-white" />
          </div>
        </div>

      </div>
    </div>
  );    <div className="w-fill h-16 bg-white ">
        <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
            <div>
                <Link href="/">
                <span className='text-xl font-600'>Easy Shop</span>
                </Link>
            </div>
            <div className='w-[50%] relative'>
                <input type="text" className='w-full px-4 font-poppins border-[2.5px]  border-[#3489FF] rounded-md outline-none h-[55px]' placeholder='Search...' />
                <div className='w-10 h-10 bg-[#3489FF] rounded-md absolute top-1/2 -translate-y-1/2 right-1 flex items-center justify-center cursor-pointer'>
                
            </div>


        </div>
    </div>
  )
}

export default Header