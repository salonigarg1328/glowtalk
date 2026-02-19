import axios from 'axios';
import { toast } from 'react-toastify';

const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');

    if (!token) {
      toast.error('Please login again');
      throw new Error('No token found');
    }

    let requestData;
    let headers = {};

    // ✅ File hai toh FormData
    if (body.file) {
      requestData = new FormData();
      requestData.append('chatId', body.chatId);
      if (body.message) {
        requestData.append('message', body.message);
      }
      requestData.append('file', body.file);
      // Content-Type mat set karo - browser khud set karega
    } else {
      // ✅ Normal text message
      requestData = body;
      headers['Content-Type'] = 'application/json';
    }

    const { data } = await API(token).post('/api/message', requestData, { headers });
    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error.response?.data || error.message);
    toast.error('Failed to send message');
    throw error;
  }
};

export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');

    if (!token || !id) {
      return [];
    }

    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.error('Error in fetchMessages:', error.response?.data || error.message);
    return [];
  }
};