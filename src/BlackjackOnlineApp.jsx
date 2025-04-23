import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import { useGameContext } from './context/GameContext';
import LoginRegister from './components/auth/LoginRegister';
import LobbyView from './components/lobby/LobbyView';
import TableView from './components/game/TableView';

const BlackjackOnlineApp = () => {
  // Obtener contextos
  const { user } = useUserContext();
  const { 
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
  } = useGameContext();
  
  // Estado local para controlar la vista
  const [view, setView] = useState('login');
  const navigate = useNavigate();
  
  // Detectar cambios en la autenticación
  useEffect(() => {
    if (user) {
      setView('lobby');
      fetchTables();
    } else {
      setView('login');
    }
  }, [user, fetchTables]);
  
  // Refrescar las mesas periódicamente cuando está en el lobby
  useEffect(() => {
    if (view === 'lobby') {
      fetchTables();
      const interval = setInterval(fetchTables, 5000);
      return () => clearInterval(interval);
    }
  }, [view, fetchTables]);
  
  // Actualizar vista cuando cambia la mesa actual
  useEffect(() => {
    if (currentTable) {
      setView('table');
    } else if (user) {
      setView('lobby');
    }
  }, [currentTable, user]);
  
  // Manejar creación de mesa
  const handleCreateTable = async (tableName) => {
    const result = await createTable(tableName);
    if (!result.success) {
      alert('Error al crear la mesa: ' + result.error);
    }
  };
  
  // Manejar unirse a una mesa
  const handleJoinTable = async (tableId) => {
    const result = await joinTable(tableId);
    if (!result.success) {
      alert('Error al unirse a la mesa: ' + result.error);
    }
  };
  
  // Salir de una mesa
  const handleLeaveTable = async () => {
    const result = await leaveTable();
    if (!result.success) {
      alert('Error al salir de la mesa: ' + result.error);
    }
  };
  
  // Iniciar partida
  const handleStartGame = async () => {
    const result = await startGame();
    if (!result.success) {
      alert('Error al iniciar el juego: ' + result.error);
    }
  };
  
  // Realizar una apuesta
  const handlePlaceBet = async (amount) => {
    console.log('Realizando apuesta:', amount);
    const result = await placeBet(amount);
    if (!result.success) {
      alert('Error al realizar la apuesta: ' + result.error);
    }
  };
  
  // Acciones del jugador
  const handlePlayerAction = async (action) => {
    const result = await playerAction(action);
    if (!result.success) {
      alert('Error al realizar la acción: ' + result.error);
    }
  };
  
  // Redirección basada en autenticación
  useEffect(() => {
    if (view === 'login' && user) {
      navigate('/game');
    }
  }, [view, user, navigate]);
  
  // Renderizar la vista correspondiente
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {!connected && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Conectando al servidor...
          </div>
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