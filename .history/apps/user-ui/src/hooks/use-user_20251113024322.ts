import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';




/*************  ✨ Windsurf Command 🌟  *************/
/**
 * Fetch the current user from the API.
 *
 * @returns {Promise<any>} The user object fetche
 *d from the API.
 */
const fetchUser = async (): Promise<any> => {
  /**
   * Make a GET request to the /api/user endpoint
   * to fetch the current user.
   */
  const response = await axiosInstance.get('/api/user');
  return response.data;
/*************  ✨ Windsurf Command 🌟  *************/
/**
 * Fetch the current user from the API.
 *
 * This function makes a GET request to the /api/user
 * endpoint to fetch the current user.
 *
 * @returns {Promise<any>} The user object fetched from the API.
 */
fetchUser = async (): Promise<any> => {
  /**
   * Make a GET request to the /api/user endpoint
   * to fetch the current user.
   */
  const { data } = await axiosInstance.get('/api/user');
  return data;
fetchUser = async () => {
    const response = await axiosInstance.get('/api/user');
    return response.data;
};
/*******  5f1a7703-1812-4a98-869e-03499daeee6a  *******/
/*******  14eab8c4-afb9-4faf-ab63-572e03976bbd  *******/