import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { url } from '../urlToBE';

export const socket = io( `${url}`)

export const WebSocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebSocketContext.Provider;