import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useGameContext } from '../context/GameContext';
import LobbyView from '../components/lobby/LobbyView';
import TableView from '../components/game/TableView';
import '../styles/Game.css';

const Game = () => {
  const { user, logout, loading } = useUserContext();
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
  const navigate = useNavigate();
  
  // Verificar autenticación
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    } else if (user) {
      // Cargar datos iniciales del juego - single call, no interval
      fetchTables();
    }
  }, [user, loading, navigate, fetchTables]);
  
  // Función de cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle table creation
  const handleCreateTable = async (tableName) => {
    const result = await createTable(tableName);
    if (!result.success) {
      alert('Error al crear la mesa: ' + result.error);
    }
  };
  
  // Handle joining a table
  const handleJoinTable = async (tableId) => {
    const result = await joinTable(tableId);
    console.log('Resultado de unirse a la mesa:', result);
    if (!result.success) {
      alert('Error al unirse a la mesa: ' + result.error);
    }
  };
  
  // Leave a table
  const handleLeaveTable = async () => {
    const result = await leaveTable();
    if (!result.success) {
      alert('Error al salir de la mesa: ' + result.error);
    }
  };
  
  // Start game
  const handleStartGame = async () => {
    const result = await startGame();
    if (!result.success) {
      alert('Error al iniciar el juego: ' + result.error);
    }
  };
  
  // Place a bet
  const handlePlaceBet = async (amount) => {
    console.log('Realizando apuesta:', amount);
    const result = await placeBet(amount);
    if (!result.success) {
      alert('Error al realizar la apuesta: ' + result.error);
    }
  };
  
  // Player actions
  const handlePlayerAction = async (action) => {
    const result = await playerAction(action);
    if (!result.success) {
      alert('Error al realizar la acción: ' + result.error);
    }
  };

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-amber-500 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <header className="game-header bg-gray-900 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500">Casino DICSAS</h1>
          {user && (
            <div className="user-info flex items-center space-x-4">
              <span className="text-amber-300">
                {user.username} - {user.coins} fichas
              </span>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="game-area">
        {!connected ? (
          <div className="text-center p-8 text-red-500">
            Conectando al servidor...
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {currentTable ? (
              <TableView 
                user={user}
                table={currentTable}
                onLeaveTable={handleLeaveTable}
                onStartGame={handleStartGame}
                onPlaceBet={handlePlaceBet}
                onPlayerAction={handlePlayerAction}
              />
            ) : (
              <LobbyView 
                user={user}
                tables={tables}
                onCreateTable={handleCreateTable}
                onJoinTable={handleJoinTable}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
