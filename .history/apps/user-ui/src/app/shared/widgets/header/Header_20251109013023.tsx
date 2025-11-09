import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="header">
        <div className="header-content">
            <div>
                <Link href="/">Home</Link>
            </div>


        </div>
    </div>
  )
}

export default Header