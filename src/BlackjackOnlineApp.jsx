import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LoginRegister from './components/auth/LoginRegister';
import LobbyView from './components/lobby/LobbyView';
import TableView from './components/game/TableView';

// Definimos la URL del servidor
const SERVER_URL = 'http://localhost:3001';

// Componente principal
const BlackjackOnlineApp = () => {
  // Estado del usuario
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  
  // Estado de la aplicación
  const [view, setView] = useState('login'); // login, lobby, table
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  
  // Inicializar socket
  useEffect(() => {
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
  }, []);
  
  // Manejadores de eventos para el socket
  useEffect(() => {
    if (!socket) return;
    
    // Escuchar actualizaciones de la mesa
    socket.on('tableUpdate', (tableData) => {
      if (tableData.id === currentTable?.id) {
        setCurrentTable(tableData);
      }
      
      // Actualizar la lista de mesas en el lobby
      fetchTables();
    });
    
    // Cambios de estado del juego
    socket.on('gameStatusChange', ({ status }) => {
      console.log('Cambio de estado del juego:', status);
    });
    
    // Fin del juego
    socket.on('gameOver', (results) => {
      console.log('Juego terminado:', results);
      
      // Actualizar monedas del usuario
      if (user) {
        const player = results.players.find(p => p.id === user.id);
        if (player) {
          setUser(prevUser => ({
            ...prevUser,
            coins: player.coins
          }));
        }
      }
    });
    
    return () => {
      socket.off('tableUpdate');
      socket.off('gameStatusChange');
      socket.off('gameOver');
    };
  }, [socket, currentTable, user]);
  
  // Recuperar lista de mesas
  const fetchTables = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/tables`);
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  };
  
  // Refrescar las mesas periódicamente
  useEffect(() => {
    if (view === 'lobby') {
      fetchTables();
      const interval = setInterval(fetchTables, 5000);
      return () => clearInterval(interval);
    }
  }, [view]);
  
  // Manejar registro/login
  const handleLogin = (username) => {
    if (!socket || !connected) return;
    
    socket.emit('register', { username }, (response) => {
      if (response.success) {
        setUser({
          id: response.userId,
          username,
          coins: response.coins
        });
        setView('lobby');
        fetchTables();
      } else {
        alert('Error al iniciar sesión: ' + response.error);
      }
    });
  };
  
  // Crear una nueva mesa
  const handleCreateTable = async (tableName) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${SERVER_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tableName,
          createdBy: user.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Unirse a la mesa automáticamente
        handleJoinTable(data.id);
      } else {
        alert('Error al crear la mesa: ' + data.error);
      }
    } catch (error) {
      console.error('Error al crear la mesa:', error);
    }
  };
  
  // Unirse a una mesa
  const handleJoinTable = (tableId) => {
    if (!socket || !user) return;
    
    socket.emit('joinTable', { userId: user.id, tableId }, (response) => {
      if (response.success) {
        setCurrentTable(response.table);
        setView('table');
      } else {
        alert('Error al unirse a la mesa: ' + response.error);
      }
    });
  };
  
  // Salir de una mesa
  const handleLeaveTable = () => {
    if (!socket || !user) return;
    
    socket.emit('leaveTable', { userId: user.id }, (response) => {
      if (response.success) {
        setCurrentTable(null);
        setView('lobby');
        fetchTables();
      } else {
        alert('Error al salir de la mesa: ' + response.error);
      }
    });
  };
  
  // Iniciar una partida (fase de apuestas)
  const handleStartGame = () => {
    if (!socket || !user || !currentTable) return;
    
    socket.emit('startGameBetting', { 
      userId: user.id, 
      tableId: currentTable.id 
    }, (response) => {
      if (!response.success) {
        alert('Error al iniciar el juego: ' + response.error);
      }
    });
  };
  
  // Realizar una apuesta
  const handlePlaceBet = (amount) => {
    if (!socket || !user) return;
    
    socket.emit('placeBet', { userId: user.id, amount }, (response) => {
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          coins: response.coins
        }));
      } else {
        alert('Error al realizar la apuesta: ' + response.error);
      }
    });
  };
  
  // Acciones del jugador
  const handlePlayerAction = (action) => {
    if (!socket || !user) return;
    
    socket.emit('playerAction', { userId: user.id, action }, (response) => {
      if (!response.success) {
        alert('Error al realizar la acción: ' + response.error);
      }
    });
  };
  
  // Renderizar la vista correspondiente
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {!connected && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Conectando al servidor...
          </div>
        )}
        
        {view === 'login' && (
          <LoginRegister onLogin={handleLogin} />
        )}
        
        {view === 'lobby' && (
          <LobbyView 
            user={user}
            tables={tables}
            onCreateTable={handleCreateTable}
            onJoinTable={handleJoinTable}
          />
        )}
        
        {view === 'table' && currentTable && (
          <TableView 
            user={user}
            table={currentTable}
            onLeaveTable={handleLeaveTable}
            onStartGame={handleStartGame}
            onPlaceBet={handlePlaceBet}
            onPlayerAction={handlePlayerAction}
          />
        )}
      </div>
    </div>
  );
};

export default BlackjackOnlineApp;