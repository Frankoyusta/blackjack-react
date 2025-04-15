import React from 'react';
import Card from '../cards/Card';
import Hand from '../cards/Hand';

const Player = ({ player, isCurrentUser, isTurn, onPlayerAction }) => {
  const handValue = calculateHandValue(player.hand);
  const isBusted = handValue > 21;

  return (
    <div className={`mb-6 p-4 rounded-lg ${isTurn ? 'bg-blue-100' : 'bg-gray-100'} ${isBusted ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-semibold">
            {player.username} {isCurrentUser ? '(Tú)' : ''}
          </h3>
          <p>RPEREZCoins: {player.coins}</p>
          {player.bet > 0 && <p>Apuesta: {player.bet}</p>}
        </div>
        {isBusted && <span className="text-red-600 font-bold">¡Perdió!</span>}
        {player.status === 'blackjack' && <span className="text-green-600 font-bold">¡Blackjack!</span>}
        {player.status === 'won' && <span className="text-green-600 font-bold">¡Ganó!</span>}
        {player.status === 'lost' && <span className="text-red-600 font-bold">¡Perdió!</span>}
        {player.status === 'push' && <span className="text-blue-600 font-bold">¡Empate!</span>}
      </div>

      <Hand cards={player.hand} label={`Mano (${handValue})`} />

      {isTurn && isCurrentUser && (
        <div className="flex space-x-2 mt-2">
          <button onClick={() => onPlayerAction('hit')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
            Pedir
          </button>
          <button onClick={() => onPlayerAction('stand')} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
            Plantarse
          </button>
          {player.hand.length === 2 && (
            <button onClick={() => onPlayerAction('double')} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded" disabled={player.coins < player.bet}>
              Doblar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces += 1;
      value += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

export default Player;