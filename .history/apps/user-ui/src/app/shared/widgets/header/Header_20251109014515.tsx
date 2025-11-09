import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-fill h-16 bg-white ">
        <div className="w-[90%] py-5 h-full mx-auto flex items-center justify-between">
            <div>
                <Link href="/">
                <span className='text-xl font-600'>Easy Shop</span>
                </Link>
            </div>
            <div className='w-[50%] re'>
                
            </div>


        </div>
    </div>
  )
}

export default Header