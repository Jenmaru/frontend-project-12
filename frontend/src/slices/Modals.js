import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { show: false, type: null, id: null },
  reducers: {
    openModal: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    closeModal: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
});

export const { actions } = modalSlice;
export default modalSlice.reducer;
