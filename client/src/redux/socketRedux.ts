import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type SocketState = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
};

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    socketConnect: (state, action) => {
      state.socket = action.payload;
    },
    socketDisconnect: (state) => {
      state.socket = null;
    },
  },
});

export type { SocketState };
export const { socketConnect, socketDisconnect } = socketSlice.actions;
export default socketSlice.reducer;
