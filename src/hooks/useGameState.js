import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

const useGameState = () => {
  const [gameState, setGameState] = useState({
    players: [],
    dealer: null,
    currentPlayerId: null,
    status: 'waiting',
  });
  
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (updatedGameState) => {
      setGameState(updatedGameState);
    };

    socket.on('gameUpdate', handleGameUpdate);

    return () => {
      socket.off('gameUpdate', handleGameUpdate);
    };
  }, [socket]);

  const startGame = () => {
    socket.emit('startGame');
  };

  const placeBet = (amount) => {
    socket.emit('placeBet', { amount });
  };

  const playerAction = (action) => {
    socket.emit('playerAction', { action });
  };

  return {
    gameState,
    startGame,
    placeBet,
    playerAction,
  };
};

export default useGameState;