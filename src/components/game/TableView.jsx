import { useState } from 'react';
import Card from '../cards/Card';
import BettingPhase from './BettingPhase';
import Player from './Player';

const TableView = ({ 
  user, 
  table, 
  onLeaveTable, 
  onStartGame, 
  onPlaceBet, 
  onPlayerAction 
}) => {
  const [betAmount, setBetAmount] = useState(10);
  
  const currentPlayer = table.players.find(p => p.id === user.id);
  const isCreator = table.createdBy === user.id;

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

  const HandComponent = ({ cards, hidden = false, label }) => {
    const value = calculateHandValue(cards);
    
    return (
      <div className="mb-4 bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{label}</h3>
          {!hidden && <span className="font-bold">Valor: {value}</span>}
        </div>
        <div className="flex flex-wrap">
          {cards.map((card, index) => (
            <Card 
              key={index} 
              card={card} 
              hidden={hidden && index === 0} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{table.name}</h1>
        <div className="text-right">
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-gray-600">RPEREZCoins: {user.coins}</p>
        </div>
      </div>
      
      <button 
        onClick={onLeaveTable}
        className="mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Salir de la Mesa
      </button>
      
      {table.status == 'waiting' && isCreator && (
        <button 
          onClick={onStartGame}
          className="ml-2 mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          disabled={table.players.length < 1}
        >
          Iniciar Juego
        </button>
      )}
      
      {table.status === 'betting' && (
        <BettingPhase 
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={onPlaceBet}
          currentPlayer={currentPlayer}
          user={user}
        />
      )}
      
      {table.dealer && table.dealer.hand.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Dealer</h2>
          <HandComponent 
            cards={table.dealer.hand}
            hidden={table.gamePhase !== 'dealer' && table.gamePhase !== 'results'}
            label="Mano del Dealer"
          />
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Jugadores</h2>
        {table.players.map(player => (
          <Player 
            key={player.id}
            player={player}
            isCurrentUser={player.id === user.id}
            isTurn={player.id === table.currentPlayerId}
            onPlayerAction={onPlayerAction}  // Add this line
        />
        ))}
      </div>
      
      {table.status === 'waiting' && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-bold mb-2">Esperando para comenzar</h3>
          {isCreator ? (
            <p>Como creador de la mesa, puedes iniciar el juego cuando estés listo.</p>
          ) : (
            <p>Esperando a que el creador de la mesa inicie el juego...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableView;