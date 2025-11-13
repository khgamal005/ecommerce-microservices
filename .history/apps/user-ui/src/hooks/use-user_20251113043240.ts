// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { useEffect } from 'react';

const fetchUser = async () => {
  const response = await axiosInstance.get('/api/logged-in-user');
  return response.data.user;
};

const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post('/api/logout');
  return response.data;
};

const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryOnMount: false,
  });

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [queryClient]);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      queryClient.setQueryData(['user'], null);
      window.dispatchEvent(new Event('authChange'));
    }
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return { 
    user, 
    isLoading, 
    error, 
    refetch,
    logout,
    isLoggingOut: logoutMutation.isPending
  };
};

export default useUser;