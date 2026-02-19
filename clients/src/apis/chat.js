import axios from 'axios';
import { toast } from 'react-toastify';

// FIX: Use REACT_APP_API_URL instead of REACT_APP_SERVER_URL
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_API_URL, // ✅ Changed from REACT_APP_SERVER_URL
    headers: { Authorization: `Bearer ${token}` }, // ✅ Added "Bearer"
  });

export const acessCreate = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat', body);
    console.log(data);
    return data;
  } catch (error) {
    console.error('error in access create api:', error);
    toast.error('Failed to create chat');
    throw error;
  }
};

export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get('/api/chat');
    return data;
  } catch (error) {
    console.error('error in fetch all chats api:', error);
    // Don't show toast for fetch errors, handle in component
    throw error;
  }
};

export const createGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat/group', body);
    toast.success(`${data.chatName} Group Created`);
    return data;
  } catch (error) {
    console.error('error in create group api:', error);
    toast.error('Failed to create group');
    throw error;
  }
};

export const addToGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/groupAdd', body);
    toast.success('User added to group');
    return data;
  } catch (error) {
    console.error('error in addtogroup api:', error);
    toast.error('Failed to add user');
    throw error;
  }
};

export const renameGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/group/rename', body);
    toast.success('Group renamed');
    return data;
  } catch (error) {
    console.error('error in rename group api:', error);
    toast.error('Failed to rename group');
    throw error;
  }
};

export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    toast.success('User removed from group');
    return data;
  } catch (error) {
    console.error('error in remove user api:', error);
    toast.error('Failed to remove user');
    throw error;
  }
};