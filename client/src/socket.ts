import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL_SOCKET_IO;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
});
