import { User } from 'apps/user-ui/src/types/user';
import Image from 'next/image';

const ProfileHeader = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm">
      <Image
        src={user.images?.[0]?.url || '/avatar-placeholder.png'}
        alt="Avatar"
        width={80}
        height={80}
        className="rounded-full object-cover"
      />

      <div>
        <h2 className="text-xl font-semibold">
          {user.name || 'Anonymous User'}
        </h2>
        <p className="text-gray-500">{user.email}</p>

        <div className="flex gap-6 mt-3 text-sm text-gray-600">
          {/* <span>📦 Orders: {user.orders.length}</span>
          <span>⭐ Reviews: {user.shopReviews.length}</span>
          <span>👥 Following: {user.followings.length}</span> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
