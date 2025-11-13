import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';



const fetchUser = async () => {
    const response = await axiosInstance.get('/api/user');
    return response.data;
};