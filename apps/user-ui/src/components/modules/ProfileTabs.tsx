'use client';

import { useState } from 'react';
import { User } from '../../types/user';

const tabs = ['Orders', 'Reviews', 'Following'];

const ProfileTabs = ({ user }: { user: User }) => {
  const [active, setActive] = useState('Orders');

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-medium ${
              active === tab
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* {active === 'Orders' && (
          <p>You have {user.orders.length} orders</p>
        )}

        {active === 'Reviews' && (
          <p>You wrote {user.shopReviews.length} reviews</p>
        )}

        {active === 'Following' && (
          <p>Following {user.followings.length} shops</p>
        )} */}
      </div>
    </div>
  );
};

export default ProfileTabs;
