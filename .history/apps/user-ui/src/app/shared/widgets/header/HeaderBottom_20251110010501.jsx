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
    <div className='w-'>
      <div>
        {sticky && <div className="sticky-header">Sticky Header</div>}
      </div>
    </div>
  )
}

export default HeaderBottom