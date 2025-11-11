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
          
      </div>
    </div>
  )   
}

export default HeaderBottom