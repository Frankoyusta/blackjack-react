import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    currentTable: null,
    user: null,
    tables: [],
    connected: false,
  });

  const updateGameState = (newState) => {
    setGameState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <GameContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};