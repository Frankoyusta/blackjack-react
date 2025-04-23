import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useGameContext } from '../context/GameContext';
import BlackjackOnlineApp from '../BlackjackOnlineApp';
import '../styles/Game.css';

const Game = () => {
  const { user, logout, loading } = useUserContext();
  const { connected, fetchTables } = useGameContext();
  const navigate = useNavigate();
  
  // Verificar autenticación
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    } else if (user) {
      // Cargar datos iniciales del juego
      fetchTables();
    }
  }, [user, loading, navigate, fetchTables]);
  
  // Función de cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/');
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
          <BlackjackOnlineApp />
        )}
      </main>
    </div>
  );
};

export default Game;
