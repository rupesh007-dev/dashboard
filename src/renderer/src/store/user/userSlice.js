import { createSlice } from '@reduxjs/toolkit';

const authorizedRoles = ['admin', 'superAdmin'];

const initialState = {
  value: { username: '', userId: 0, token: '', email: '', role: '' },
  loggedIn: false,
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, userId, token, email, role } = action.payload;
      state.value = { username, userId, token, email, role };
      state.loggedIn = true;
      state.isAuthorized = authorizedRoles.includes(role);
    },
    logout: (state) => {
      state.value = initialState.value;
      state.loggedIn = false;
      state.isAuthorized = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
