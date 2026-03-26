import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_API_URL ||
  "https://nu4p-backend-production-7cea.up.railway.app";

if (!SOCKET_URL) {
  throw new Error("Geen SOCKET_URL ingesteld");
}

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});
