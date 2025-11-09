import Link from 'next/link'
import React from 'react'
import { Search, User } from "lucide-react";
import EasyShopLogo from 'apps/user-ui/src/assets/svgs/EasyShopLogo';

const Header = () => {
  return (
    <div className="w-full h-16 bg-white">
      <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
        
        {/* Logo - Left */}
        <div className="flex-1">
          <Link href="/">
            <span className="text-xl font-semibold">
                <EasyShopLogo />


            </span>
          </Link>
        </div>

        {/* Search Box - Middle */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              className="w-full px-4 font-medium border-[2.5px] border-[#3489FF] rounded-md outline-none h-[55px]"
              placeholder="Search..."
            />
            {/* Search Icon Button */}
            <div className="w-[60px] h-[55px] bg-[#3489FF] cursor-pointer flex items-center justify-center rounded-md absolute top-0 right-0">
              <Search size={20} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>

        {/* Login & User - Right */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-6">
            {/* Login Link */}
            <Link href="/login" className="border-2 w-[50px] h-[50px] flex justify-center items-center rounded-full border-[#010f1c1a] ">
              <User size={28} strokeWidth={2.3} />
            </Link>
            
            {/* User Greeting */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Hello,</span>
              <span className="text-sm font-medium">sign in</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href='/whishlist' className="text-sm font-medium"><He></Link>
        </div>

      </div>
    </div>
  );   
}

export default Header