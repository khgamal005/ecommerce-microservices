import { AlignLeft, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [sticky, setSticky] = useState(false);
   useEffect(() => {
     const handleScroll = () => {
       if (window.scrollY > 100) {
          setSticky(true);
       } else {
          setSticky(false);
       }
     };

     window.addEventListener("scroll", handleScroll);
     return () => {
       window.removeEventListener("scroll", handleScroll);
     };
  }, []);

  return (
    <div className={`w-full transition-all duration-300 ease-in-out ${sticky ? 
    'fixed top-0 left-0 bg-white shadow-md z-50' : 'relative bg-transparent'}`}>
      <div className={`w-[80%] m-auto flex items-center justify-between h-12 relative ${sticky ? 'pt-3' : 'py-0 '}`}>
       {/* all dropdown-menu */}
       <div className={`absolute top-full left-0 w-[260px] bg-[#3489FF] shadow-md ${sticky && '-mt-2'} cursor-pointer
        flex items-center justify-between`} onClick={!show ? () => setShow(true) : () => setShow(false)}>
          <div className="px-4 py-2 flex items-center gap-2">
           <AlignLeft color='white' />
            <span className="font-medium text-white">All Department</span>
          </div>
            <ChevronDown className="w-3 h-3" color='white'/>
       </div>
      {/* all dropdown-menu end */}
      {/* nav items */}
       <div className="flex items-center gap-6">  
         <span className="font-medium text-white">Home</span>
         <span className="font-medium text-white">Shop</span>
         <span className="font-medium text-white">About</span>
         <span className="font-medium text-white">Contact</span>
        </div>
    </div>
  )   
}

export default HeaderBottom