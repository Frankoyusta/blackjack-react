import { io } from 'socket.io-client';

// Definimos la URL del servidor
// eslint-disable-next-line no-undef
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Crear una conexión de socket
const createSocket = (onConnect, onDisconnect) => {
  const socket = io(SERVER_URL);

  socket.on('connect', () => {
    console.log('Conectado al servidor');
    if (onConnect) onConnect();
  });

  socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    if (onDisconnect) onDisconnect();
  });

  return socket;
};

// Función para emitir eventos
const emitEvent = (socket, event, data, callback) => {
  socket.emit(event, data, callback);
};

// Función para escuchar eventos
const listenEvent = (socket, event, callback) => {
  socket.on(event, callback);
};

// Función para desconectar el socket
const disconnectSocket = (socket) => {
  if (socket) {
    socket.disconnect();
  }
};

export { createSocket, emitEvent, listenEvent, disconnectSocket };