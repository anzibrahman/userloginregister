import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

const getUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};

const updateUser = async (id, userData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, userData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};

const deleteUser = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};

const userService = {
  getUsers,
  updateUser,
  deleteUser
};

export default userService;
