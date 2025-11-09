import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-fill h-16 bg-white ">
        <div className="w-">
            <div>
                <Link href="/">
                <span>Easy Shop</span>
                </Link>
            </div>


        </div>
    </div>
  )
}

export default Header