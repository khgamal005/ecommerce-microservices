import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w">
        <div className="header-content">
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