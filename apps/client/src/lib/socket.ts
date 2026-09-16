import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    let serverUrl: string | undefined = undefined;
    const envUrl = import.meta.env.VITE_SERVER_URL;
    if (typeof envUrl === 'string' && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
      serverUrl = envUrl.replace(/\/+$/, '');
    } else if (import.meta.env.PROD) {
      serverUrl = 'https://zync-server-zt02.onrender.com';
    }

    socketInstance = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling']
    });
  }
  return socketInstance;
}

export function connectSocket(): Socket {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
  }
}
