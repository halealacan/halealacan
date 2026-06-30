import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import ticketsReducer from './ticketSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tickets: ticketsReducer,
  },
});
