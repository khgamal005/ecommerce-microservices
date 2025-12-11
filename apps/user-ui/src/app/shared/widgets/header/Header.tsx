'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  HeartIcon,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import EasyShopLogo from 'apps/user-ui/src/assets/svgs/EasyShopLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import HeaderBottom from './HeaderBottom';
import useUser from 'apps/user-ui/src/hooks/use-user';
import { useStore } from 'apps/user-ui/src/store';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, logout, isLoggingOut, refetch } = useUser();

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  // Refetch user on route change (especially after login redirect)
  useEffect(() => {
    refetch();
  }, [pathname, refetch]);



  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      refetch();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [refetch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  if (!mounted) {
    return (
      <div className="w-full h-16 bg-white border-b">
        <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
          <div className="flex-1 lg:flex-1">
            <Link href="/">
              <span className="text-xl font-semibold">
                <EasyShopLogo />
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex flex-1 justify-end">
            <div className="flex items-center gap-6">
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <HeaderBottom />
      </div>
    );
  }

  return (
    <div className="w-full h-16 bg-white border-b">
      <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1 lg:flex-1">
          <Link href="/">
            <span className="text-xl font-semibold">
              <EasyShopLogo />
            </span>
          </Link>
        </div>

        {/* Search Box */}
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

        {/* Desktop: Login & User */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div className="flex items-center gap-6">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                  <DropdownMenuItem
                    disabled
                    className="px-4 py-2 text-gray-500 text-sm"
                  >
                    Hi, {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href="/profile" className="w-full block">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Wishlist & Cart */}
            <div className="flex items-center gap-5">
              <Link
                href="/whishlist"
                className="relative hover:text-red-500 transition-colors"
              >
                <HeartIcon size={24} />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist?.length || 0}
                </div>
              </Link>
              <Link
                href="/cart"
                className="relative hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={24} />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart?.length || 0}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart size={24} />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart?.length || 0}
            </div>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="w-[90%] mx-auto py-4">
            <div className="space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <User size={20} />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                  >
                    <span className="font-medium">
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="font-medium">Login / Sign Up</span>
                </Link>
              )}

              <Link
                href="/whishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HeartIcon size={20} />
                <span className="font-medium">Wishlist</span>
                <div className="ml-auto bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {wishlist?.length || 0}
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
                  {cart?.length || 0}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      <HeaderBottom />
    </div>
  );
};

export default Header;
