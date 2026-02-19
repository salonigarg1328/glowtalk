import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchAllChats } from '../apis/chat';

const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
};

export const fetchChats = createAsyncThunk('redux/chats', async () => {
  try {
    const data = await fetchAllChats();
    return data;
  } catch (error) {
    toast.error('Something Went Wrong! Try Again');
  }
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },
  extraReducers: {
    [fetchChats.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.chats = payload || []; // ✅ FIX 1: undefined se bachao
    },
    [fetchChats.rejected]: (state) => {
      state.isLoading = false;
      state.chats = []; // ✅ FIX 2: reject pe empty array
    },
  },
});

export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;