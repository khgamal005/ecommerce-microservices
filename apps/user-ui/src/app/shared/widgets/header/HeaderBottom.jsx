import { Routes } from 'apps/user-ui/src/constants/enums';
import useUser from 'apps/user-ui/src/hooks/use-user';
import { AlignLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);


  const links = [
    { title: "Home", href: Routes.Home },
    { title: "Products", href: Routes.Products },
    { title: "Offers", href: Routes.Offers },
    { title: "Shops", href: Routes.Shops },
    { title: "Become a Seller", href: Routes.BecomeSeller },
  ];

  const departments = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", 
    "Toys & Games", "Food & Grocery", "Health", "Automotive", "Books"
  ];

  return (
    <div
      className="absolute top-[64px] left-0 w-full bg-white shadow-lg z-50 border-b border-gray-100"
    >
      <div className="w-[90%] max-w-7xl m-auto flex items-center justify-between h-14">
        {/* All Departments Dropdown */}
        <div className="relative">
          <div
            className="w-64 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 cursor-pointer flex items-center justify-between group"
            onClick={() => setShow(!show)}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <AlignLeft size={20} color="white" />
              <span className="font-semibold text-white text-sm uppercase tracking-wide">
                All Departments
              </span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${show ? 'rotate-180' : ''}`} 
              color="white" 
            />
          </div>

          {/* Dropdown Menu */}
          {show && (
            <div className="absolute left-0 w-64 bg-white shadow-xl rounded-b-md border border-gray-200 mt-1 z-50 max-h-96 overflow-y-auto">
              <ul className="py-2">
                {departments.map((department, index) => (
                  <li 
                    key={index}
                    className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <button className="w-full text-left text-gray-700 hover:text-blue-600 font-medium text-sm">
                      {department}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex items-center gap-1">
            {links.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href}
                  className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm rounded-md transition-colors duration-200 hover:bg-gray-50 whitespace-nowrap"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Empty space for balance */}
        <div className="w-64"></div>
      </div>
    </div>
  );
};

export default HeaderBottom;