"use client";

import { io, type Socket } from "socket.io-client";

// Socket.io cannot go through the Vercel proxy (no WebSocket hosting), so in
// production it connects straight to the API. Falls back to the normal API
// URL, then to localhost, so local development is unchanged.
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

let socket: Socket | null = null;

/** Singleton Socket.io client -- one connection shared across the app,
 *  not one per component that happens to use it. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true, autoConnect: true });
  }
  return socket;
}
