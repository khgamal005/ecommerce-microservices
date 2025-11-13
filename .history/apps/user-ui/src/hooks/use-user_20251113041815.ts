// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

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
    retryOnMount: false, // Add this to prevent auto-refetch on mount after logout
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Immediately clear the user data from cache
      queryClient.setQueryData(['user'], null);
      
      // Remove all queries related to user
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['orders'] });
      
      // Invalidate any other user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  });

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Still clear local state even if API call fails
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  };

  return { 
    user, 
    isLoading: isLoading && !logoutMutation.isSuccess, // Don't show loading if logout was successful
    error, 
    refetch,
    logout,
    isLoggingOut: logoutMutation.isPending
  };
};

export default useUser;