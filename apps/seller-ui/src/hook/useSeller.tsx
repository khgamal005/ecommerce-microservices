// hooks/useSeller.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const fetchSeller = async () => {
  const response = await axiosInstance.get('/api/logged-in-seller');
  return response.data.seller; // Changed from response.data.user to response.data.seller
};

const logoutSeller = async (): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post('/api/logout');
  return response.data;
};

export const useSeller = () => {
  const queryClient = useQueryClient();

  const {
    data: seller,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['seller'],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryOnMount: false,
  });

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      queryClient.invalidateQueries({ queryKey: ['seller'] });
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [queryClient]);

  const logoutMutation = useMutation({
    mutationFn: logoutSeller,
    onSuccess: () => {
      queryClient.setQueryData(['seller'], null);
      queryClient.removeQueries({ queryKey: ['seller'] });
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      queryClient.setQueryData(['seller'], null);
      window.dispatchEvent(new Event('authChange'));
    }
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return { 
    seller, 
    isLoading, 
    error, 
    refetch,
    logout,
    isLoggingOut: logoutMutation.isPending
  };
};

export default useSeller;