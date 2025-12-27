'use client';

import { useQuery } from '@tanstack/react-query';

import ProfileTabs from 'apps/user-ui/src/components/modules/ProfileTabs';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import ProfileHeader from '../../shared/widgets/header/ProfileHeader';
import useUser from 'apps/user-ui/src/hooks/use-user';
import { isError } from 'util';

export interface User {
  id: string;
  name?: string;
  email?: string;
  followings: string[];
  orders: any[];
  shopReviews: any[];
  images: { url: string }[];
  createdAt: string;
}

const ProfilePage = () => {
  const { user, isLoading } = useUser();


  if (isLoading) return <p>Loading profile...</p>;
    if (!user) return <p>User not found. Please log in.</p>;
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ProfileHeader user={user} />
      <ProfileTabs user={user} />
    </div>
  );
};

export default ProfilePage;
