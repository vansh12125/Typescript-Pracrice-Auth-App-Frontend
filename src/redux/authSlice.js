import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "authInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },  
    setLoading(state, action) {
      state.loading = action.payload;
    },
    finishInitialization(state) {
      state.initialized = true;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  login,
  logout,
  setLoading,
  finishInitialization,
  updateUser,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
