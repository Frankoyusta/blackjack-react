import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './UserContext';

const GameContext = createContext();

// eslint-disable-next-line no-undef
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const GameProvider = ({ children }) => {
  const { user, updateUserData } = useUserContext();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);

  // Inicializar socket cuando hay un usuario autenticado
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SERVER_URL);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor');
      setConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Eventos del socket y actualizaciones del juego
  useEffect(() => {
    if (!socket) return;

    socket.on('tableUpdate', (tableData) => {
      if (tableData.id === currentTable?.id) {
        setCurrentTable(tableData);
      }
    });

    socket.on('gameStatusChange', ({ status }) => {
      console.log('Cambio de estado del juego:', status);
    });

    socket.on('gameOver', (results) => {
      console.log('Juego terminado:', results);

      if (user) {
        const player = results.players.find((p) => p.id === user.id);
        if (player) {
          updateUserData({ coins: player.coins });
        }
      }
    });

    return () => {
      socket.off('tableUpdate');
      socket.off('gameStatusChange');
      socket.off('gameOver');
    };
  }, [socket, currentTable, user, updateUserData]);

  // Métodos para manejar mesas y juego con useCallback
  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/tables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  }, []);
  const joinTable = useCallback(async (tableId) => {
    if (!socket || !user) return { success: false, error: 'No conectado o no autenticado' };

    return new Promise((resolve) => {
      socket.emit('joinTable', { userId: user.id, tableId }, (response) => {
        console.log('Respuesta del servidor al unirse:', response);
        if (response.success) {
          console.log('Mesa actual antes:', currentTable);
          setCurrentTable(response.table);
          console.log('Mesa actual después:', response.table);
        }
        resolve(response);
      });
    });
  }, [socket, user, currentTable]);

  const createTable = useCallback(async (tableName) => {
    if (!user) return { success: false, error: 'No autenticado' };

    try {
      const response = await fetch(`${SERVER_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: tableName,
          createdBy: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return joinTable(data.id);
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error al crear la mesa:', error);
      return { success: false, error: error.message };
    }
  }, [user, joinTable]);

  

  const leaveTable = useCallback(async () => {
    if (!socket || !user) return { success: false, error: 'No conectado o no autenticado' };

    return new Promise((resolve) => {
      socket.emit('leaveTable', { userId: user.id }, (response) => {
        if (response.success) {
          setCurrentTable(null);
          fetchTables();
        }
        resolve(response);
      });
    });
  }, [socket, user, fetchTables]);

  const startGame = useCallback(() => {
    if (!socket || !user || !currentTable) return { success: false };

    return new Promise((resolve) => {
      socket.emit(
        'startGameBetting',
        {
          userId: user.id,
          tableId: currentTable.id,
        },
        (response) => {
          if (response.success && response.table) {
            setCurrentTable(response.table);
          }
          console.log('Respuesta del servidor al iniciar el juego:', response);
          resolve(response);
        }
      );
    });
  }, [socket, user, currentTable]);

  const placeBet = useCallback((amount) => {
    if (!socket || !user) return { success: false };

    return new Promise((resolve) => {
      socket.emit('placeBet', { userId: user.id, amount }, (response) => {
        if (response.success) {
          updateUserData({ coins: response.coins });
        }
        console.log('Respuesta del servidor al apostar:', response);
        resolve(response);

      });
    });
  }, [socket, user, updateUserData]);

  const playerAction = useCallback((action) => {
    if (!socket || !user) return { success: false };

    return new Promise((resolve) => {
      socket.emit('playerAction', { userId: user.id, action }, resolve);
    });
  }, [socket, user]);

  return (
    <GameContext.Provider
      value={{
        connected,
        tables,
        currentTable,
        fetchTables,
        createTable,
        joinTable,
        leaveTable,
        startGame,
        placeBet,
        playerAction,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGameContext() {
  return useContext(GameContext);
}