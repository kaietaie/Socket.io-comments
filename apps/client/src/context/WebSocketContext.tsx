import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io( `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORTAPI}`)

export const WebSocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebSocketContext.Provider;