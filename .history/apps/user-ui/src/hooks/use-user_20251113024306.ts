import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';




/*************  ✨ Windsurf Command 🌟  *************/
/**
 * Fetch the current user from the API.
 *
 * @returns {Promise<any>} The user object fetche
 * d from the API.
 */
const fetchUser = async (): Promise<any> => {
  /**
   * Make a GET request to the /api/user endpoint
   * to fetch the current user.
   */
  const response = await axiosInstance.get('/api/user');
  return response.data;
fetchUser = async () => {
    const response = await axiosInstance.get('/api/user');
    return response.data;
};
/*******  14eab8c4-afb9-4faf-ab63-572e03976bbd  *******/