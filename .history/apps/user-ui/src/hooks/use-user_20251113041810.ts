// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

/*************  ✨ Windsurf Command 🌟  *************/
const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/api/logged-in-user');
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      await logoutUser(); // TODO: Implement logout when user is not found
    }
    return null;
  }
const fetchUser = async () => {
  const response = await axiosInstance.get('/api/logged-in-user');
  return response.data.user;
};
/*******  5d2f8bf9-46ef-4af3-9b9a-52fb7b4d693c  *******/

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
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
      
      // Optional: Clear any other related queries
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['orders'] });
      
      // Force refetch if user navigates back
      setTimeout(() => {
        refetch();
      }, 100);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      queryClient.setQueryData(['user'], null);
    }
  });

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Still clear local state even if API call fails
      queryClient.setQueryData(['user'], null);
    }
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