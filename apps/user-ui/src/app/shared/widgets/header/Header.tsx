'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { HeartIcon, Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import EasyShopLogo from 'apps/user-ui/src/assets/svgs/EasyShopLogo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-16 bg-white border-b">
      <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
        
        {/* Logo - Left on both Mobile & Desktop */}
        <div className="flex-1 lg:flex-1">
          <Link href="/">
            <span className="text-xl font-semibold">
              <EasyShopLogo />
            </span>
          </Link>
        </div>

        {/* Search Box - Hidden on Mobile, Middle on Desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              className="w-full px-4 font-medium border-[2.5px] border-[#3489FF] rounded-md outline-none h-[55px]"
              placeholder="Search..."
            />
            <div className="w-[60px] h-[55px] bg-[#3489FF] cursor-pointer flex items-center justify-center rounded-md absolute top-0 right-0">
              <Search size={20} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>

        {/* Desktop: Login & User - Right */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div className="flex items-center gap-6">
            {/* User Section */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="border-2 w-[50px] h-[50px] flex justify-center items-center rounded-full border-[#010f1c1a] hover:bg-gray-50 transition-colors"
              >
                <User size={28} strokeWidth={2.3} />
              </Link>
              <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Hello,</span>
                  <span className="text-sm font-semibold">sign in</span>
                </div>
              </Link>
            </div>

            {/* Wishlist & Cart */}
            <div className="flex items-center gap-5">
              <Link href="/whishlist" className="relative hover:text-red-500 transition-colors">
                <HeartIcon size={24} />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </div>
              </Link>
              <Link href="/cart" className="relative hover:text-blue-600 transition-colors">
                <ShoppingCart size={24} />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE: Burger Menu & Cart - Right */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={24} />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              0
            </div>
          </Link>
          
          {/* Burger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="w-[90%] mx-auto py-4">
            
            {/* Mobile Search Box */}
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full px-4 pr-12 font-medium border-2 border-[#3489FF] rounded-md outline-none h-12"
                placeholder="Search..."
              />
              <div className="w-12 h-12 bg-[#3489FF] cursor-pointer flex items-center justify-center rounded-md absolute top-0 right-0">
                <Search size={18} className="text-white" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                <span className="font-medium">Login / Sign Up</span>
              </Link>

              <Link
                href="/whishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HeartIcon size={20} />
                <span className="font-medium">Wishlist</span>
                <div className="ml-auto bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  0
                </div>
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart size={20} />
                <span className="font-medium">Cart</span>
                <div className="ml-auto bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  0
                </div>
              </Link>
            </div>

            {/* User Greeting in Mobile Menu */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                <span>Hello, welcome to Easy Shop</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;