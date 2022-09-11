import { createSlice } from '@reduxjs/toolkit';

type User = {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _v?: number;
};

type UserState = {
  user: User | null;
  isFetching: boolean;
  error: boolean;
};

const initialState: UserState = {
  user: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logOut: (state) => {
      state.user = null;
      state.isFetching = false;
      state.error = false;
    },
    signUpStart: (state) => {
      state.isFetching = true;
    },
    signUpSuccess: (state) => {
      state.isFetching = false;
    },
    signUpFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export type { UserState };
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logOut,
  signUpStart,
  signUpSuccess,
  signUpFailure,
} = userSlice.actions;
export default userSlice.reducer;
