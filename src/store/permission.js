import { createSlice } from '@reduxjs/toolkit';

export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    api: false,
    clipboard: false,
  },

  reducers: {
    /**
     * @param {{ payload: boolean }} action
     */
    setAPI: (state, action) => {
      state.api = action.payload;
    },

    /**
     * @param {{ payload: boolean }} action
     */
    setClipboard: (state, action) => {
      state.clipboard = action.payload;
    },
  },
});

export const { setAPI, setClipboard } = permissionSlice.actions;

export const { reducer } = permissionSlice;
