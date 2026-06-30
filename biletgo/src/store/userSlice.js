import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('travel_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Sunucu hatası oluştu.');
      }
      const users = await response.json();
      if (users.length > 0) {
        return users[0];
      } else {
        return rejectWithValue('E-posta adresi veya şifre hatalı.');
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Bağlantı hatası: Sunucu aktif olmayabilir.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Check if user exists
      const checkResponse = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(userData.email)}`);
      if (!checkResponse.ok) {
        throw new Error('Sunucu hatası.');
      }
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        return rejectWithValue('Bu e-posta adresiyle zaten kayıtlı bir kullanıcı var.');
      }

      // Create new user
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Kayıt oluşturulamadı.');
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Bağlantı hatası: Sunucu aktif olmayabilir.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: getInitialUser(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('travel_user');
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        localStorage.setItem('travel_user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        localStorage.setItem('travel_user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearUserError } = userSlice.actions;
export default userSlice.reducer;
