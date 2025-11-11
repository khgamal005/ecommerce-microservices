import { AlignLeft } from 'lucide-react';
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
       <div className={`absolute top-full left-0 w-[260px] bg-white shadow-md ${sticky && '-mt-2'} cursor-pointer
        flex items-center`} onClick={!show ? () => setShow(true) : () => setShow(false)}>
          <div className="px-4 py-2 flex items-center gap-2">
           <AlignLeft co/>
          </div>
       </div>
      </div>
    </div>
  )   
}

export default HeaderBottom