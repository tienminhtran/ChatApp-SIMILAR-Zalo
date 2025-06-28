import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import friendSlice  from './slice/friendSlice';
import conversationSlice from './slice/conversationSlice';
import messageSlice from './slice/messageSlice';

const store = configureStore({
    reducer: {
      user: userSlice,
      friend: friendSlice,
      conversation: conversationSlice,
      message: messageSlice,
    }, 
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
  });

export default store;