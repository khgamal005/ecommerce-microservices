"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Bell,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "apps/user-ui/src/components/ui/dropdown-menu";
import { Routes } from "apps/user-ui/src/constants/enums";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const logo = "/logo.PNG";

  const links = [
    { title: "Home", href: "/" },
    { title: "Our Category", href: Routes.ourcategory },
    { title: "About Us", href: Routes.CONTACT },
    { title: "Contact Us", href: Routes.CONTACT },
    { title: "FAQs", href: Routes.FAQs },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("userName");
      if (token && user) {
        setIsLoggedIn(true);
        setUserName(user);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkAuth(); 
    window.addEventListener("authChange", checkAuth);

    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT: Logo + Desktop Links */}
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/davb7cdki/image/upload/v1759752570/logo_rns25z.png"
                alt="Logo"
                width={66}
                height={51}
                className="object-contain"
              />
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              {links.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Desktop Icons + Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <ShoppingBag className="w-6 h-6 cursor-pointer" />
            <Bell className="w-6 h-6 cursor-pointer" />
            <Heart className="w-6 h-6 cursor-pointer" />

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
                EN
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-1 w-24 bg-white shadow-md rounded-md border border-gray-200">
                <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                  EN
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                  AR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown or Login */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded">
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-1 w-40 bg-white shadow-md rounded-md border border-gray-200">
                  <DropdownMenuItem disabled className="px-4 py-2 text-gray-500">
                    Hi, {userName}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/profile" className="w-full block">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/signin"
                className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE: Burger + Login */}
          <div className="md:hidden flex items-center justify-end w-full">
            {!isLoggedIn && (
              <Link
                href="/signin"
                className="text-gray-700 hover:text-gray-900 font-medium mr-4"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex-shrink-0"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="px-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="px-4 border-t border-gray-200 mt-4 pt-4">
            <div className="flex items-center space-x-6">
              <ShoppingBag className="w-6 h-6 cursor-pointer" />
              <Bell className="w-6 h-6 cursor-pointer" />
              <Heart className="w-6 h-6 cursor-pointer" />

              {/* Language */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
                  EN
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-1 w-24 bg-white shadow-md rounded-md border border-gray-200">
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                    EN
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                    AR
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile User */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded">
                    <User className="w-5 h-5" />
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-1 w-40 bg-white shadow-md rounded-md border border-gray-200">
                    <DropdownMenuItem disabled className="px-4 py-2 text-gray-500">
                      Hi, {userName}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100">
                      <Link href="/profile" className="w-full block">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
