import React, { useState } from 'react';

const BettingPhase = ({ user, currentPlayer, onPlaceBet }) => {
  const [betAmount, setBetAmount] = useState(10);

  const handleBet = () => {
    onPlaceBet(betAmount);
  };

  console.log('BettingPhase - currentPlayer:', currentPlayer);
  console.log('BettingPhase - plata:', betAmount);
  

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Fase de Apuestas</h3>

      {currentPlayer && currentPlayer.bet === 0 ? (
        <div className="mb-4">
          <p className="mb-2">Tu saldo: {user.coins} RPEREZCoins</p>
          <div className="flex items-center space-x-2 mb-2">
            <button 
              onClick={() => setBetAmount(Math.max(5, betAmount - 5))}
              className="bg-red-500 text-white w-8 h-8 rounded-full"
            >
              -
            </button>
            <span className="text-xl font-bold">{betAmount}</span>
            <button 
              onClick={() => setBetAmount(Math.min(user.coins, betAmount + 5))}
              className="bg-green-500 text-white w-8 h-8 rounded-full"
            >
              +
            </button>
          </div>
          <button 
            onClick={handleBet}
            disabled={betAmount > user.coins}
            className={`px-4 py-2 rounded ${
              betAmount > user.coins 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Apostar
          </button>
        </div>
      ) : (
        <p className="text-green-600 font-semibold">
          ¡Apuesta realizada! Esperando a los demás jugadores...
        </p>
      )}
    </div>
  );
};

export default BettingPhase;