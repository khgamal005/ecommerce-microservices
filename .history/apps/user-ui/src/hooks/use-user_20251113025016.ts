import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';



const fetchUser = async () => {
    const response = await axiosInstance.get('/api/logged-in-user');
    return response.data.user;
};


const useUser = () => {
    const { data: user ,
        isLoading: isLoadingUser,   
    } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
       staleTime : 1000*60*5
       
    });

};

export default useUser;