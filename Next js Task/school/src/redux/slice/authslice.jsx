// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    LOGIN_START(state) {
      state.isLoading = true;
      state.error = null;
    },
    LOGIN_SUCCESS(state, action) {
      state.user = action.payload;  
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    LOGIN_FAIL(state, action) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    SIGNUP_START(state) {
      state.isLoading = true;
      state.error = null;
    },
    SIGNUP_SUCCESS(state, action) {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    SIGNUP_FAIL(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, SIGNUP_START, SIGNUP_SUCCESS, SIGNUP_FAIL, LOGOUT } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
