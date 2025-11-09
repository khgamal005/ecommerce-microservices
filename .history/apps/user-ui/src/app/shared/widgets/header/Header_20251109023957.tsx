import Link from 'next/link'
import React from 'react'
import { Search } from "lucide-react";


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
            className="w-full px-4 font-poppins  font-medium border-[2.5px]  border-[#3489FF] rounded-md outline-none h-[55px]"
            placeholder="Search..."
          />

          {/* Search Icon Button */}
          <div className="w-[60px] h-[55px] bg-[#3489FF] cursor-pointer flex items-center justify-center rounded-md absolute top-1.5 right-1.5">
            <Search size={20} strokeWidth={2.5} className="text-white" />
          </div>
          <div className="flex items-center gap-8">
           <div>
            
           </div>
          </div>
        </div>

      </div>
    </div>
  );   
}

export default Header