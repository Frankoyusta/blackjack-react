import React, { createContext, useContext, useState, useEffect } from 'react';
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
      fetchTables();
    });
    
    socket.on('gameStatusChange', ({ status }) => {
      console.log('Cambio de estado del juego:', status);
    });
    
    socket.on('gameOver', (results) => {
      console.log('Juego terminado:', results);
      
      if (user) {
        const player = results.players.find(p => p.id === user.id);
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

  // Métodos para manejar mesas y juego
  const fetchTables = async () => {
    
    try {
      const response = await fetch(`${SERVER_URL}/api/tables`, {
        signal: AbortSignal.timeout(5000),
        // Optional: Add headers if needed
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Check if response is OK before parsing
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
      
      
      // Optional: Implement retry logic with exponential backoff
      // if (retryCount < maxRetries) setTimeout(() => fetchTables(), 2000 * (retryCount + 1));
    } 
  };

  const createTable = async (tableName) => {
    if (!user) return { success: false, error: 'No autenticado' };
    
    try {
      const response = await fetch(`${SERVER_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: tableName,
          createdBy: user.id
        })
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
  };

  const joinTable = (tableId) => {
    if (!socket || !user) return { success: false, error: 'No conectado o no autenticado' };
    
    return new Promise((resolve) => {
      socket.emit('joinTable', { userId: user.id, tableId }, (response) => {
        if (response.success) {
          setCurrentTable(response.table);
        }
        resolve(response);
      });
    });
  };

  const leaveTable = () => {
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
  };

  const startGame = () => {
    if (!socket || !user || !currentTable) return { success: false };
    
    return new Promise((resolve) => {
      socket.emit('startGameBetting', { 
        userId: user.id, 
        tableId: currentTable.id 
      }, resolve);
    });
  };

  const placeBet = (amount) => {
    if (!socket || !user) return { success: false };
    
    return new Promise((resolve) => {
      socket.emit('placeBet', { userId: user.id, amount }, (response) => {
        if (response.success) {
          updateUserData({ coins: response.coins });
        }
        resolve(response);
      });
    });
  };

  const playerAction = (action) => {
    if (!socket || !user) return { success: false };
    
    return new Promise((resolve) => {
      socket.emit('playerAction', { userId: user.id, action }, resolve);
    });
  };

  return (
    <GameContext.Provider value={{
      connected,
      tables,
      currentTable,
      fetchTables,
      createTable,
      joinTable,
      leaveTable,
      startGame,
      placeBet,
      playerAction
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);