import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="header">
        <div className="header-content">
            <div>
                <Link href="/">
                <span>Easy</span>
                </Link>
            </div>


        </div>
    </div>
  )
}

export default Header