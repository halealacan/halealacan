import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const users = await api.getUserByEmail(email);
      const user = users[0]; // Email is unique, retrieve the first match

      if (!user || user.password !== password) {
        return rejectWithValue('Geçersiz e-posta veya şifre');
      }

      // Prepare user data without sensitive password before storing/returning
      const authUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      // Persist in sessionStorage
      sessionStorage.setItem('authUser', JSON.stringify(authUser));
      return authUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu');
    }
  }
);

// Load initial user state from sessionStorage
const storedUser = sessionStorage.getItem('authUser');
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem('authUser');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Giriş yapılamadı';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
