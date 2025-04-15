import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// eslint-disable-next-line no-undef
const SERVER_URL = import.meta.env.SERVER_URL; 

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SERVER_URL);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const emit = (event, data, callback) => {
    if (socket) {
      socket.emit(event, data, callback);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event) => {
    if (socket) {
      socket.off(event);
    }
  };

  return { socket, connected, emit, on, off };
};

export default useSocket;