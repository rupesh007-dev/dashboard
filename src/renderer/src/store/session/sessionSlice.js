import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { id: -1, taskName: '', startTime: null },
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    start: (state, action) => {
      const { id, taskName, startTime } = action.payload;
      state.value = { id, taskName, startTime };
    },
    stop: (state) => {
      state.value = initialState;
    },
  },
});

export const { start, stop } = sessionSlice.actions;
export default sessionSlice.reducer;
