import React from 'react';
import Card from './Card';

const Hand = ({ cards, hidden = false, label }) => {
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

  const handValue = calculateHandValue(cards);
  const isBlackjack = handValue === 21 && cards.length === 2;
  const isBusted = handValue > 21;

  return (
    <div className="mb-6">
      {/* Área de información de la mano */}
      <div className="flex justify-between items-center mb-3 bg-gray-800 px-4 py-2 rounded-lg shadow-md border-l-4 border-amber-500">
        <div className="flex items-center">
          <h3 className="font-bold text-lg text-white">{label}</h3>
          {isBlackjack && !hidden && (
            <span className="ml-3 bg-amber-500 text-black text-sm font-bold px-2 py-1 rounded">BLACKJACK!</span>
          )}
        </div>
        {!hidden && (
          <div className="flex items-center">
            <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center mr-2">
              <span className="text-sm text-gray-300">Total</span>
            </div>
            <span className={`font-bold text-xl ${isBusted ? 'text-red-500' : handValue >= 17 ? 'text-amber-400' : 'text-white'}`}>
              {handValue}
            </span>
          </div>
        )}
      </div>
      
      {/* Área de las cartas */}
      <div className="relative">
        {/* Tapete de juego */}
        <div className="absolute inset-0 bg-green-900 rounded-xl opacity-70 shadow-inner" style={{ top: -10, bottom: -10, left: -20, right: -20, zIndex: -1 }}></div>
        
        {/* Cartas en disposición tipo abanico */}
        <div className="flex flex-wrap pl-2 pt-2 pb-3">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="transform transition-transform duration-200 hover:translate-y-1" 
              style={{ 
                marginLeft: index === 0 ? '0' : '-1.5rem',
                zIndex: index,
                transform: `rotate(${(index - Math.floor(cards.length/2)) * 3}deg)`,
                transformOrigin: 'bottom center'
              }}
            >
              <Card card={card} hidden={hidden && index === 0} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Chips decorativos (solo para el jugador) */}
      {label.toLowerCase().includes('jugador') && (
        <div className="flex mt-2 justify-end">
          {[{ color: 'red', value: '5' }, { color: 'blue', value: '10' }, { color: 'green', value: '25' }].map((chip, idx) => (
            <div 
              key={idx}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md -mr-2 ${chip.color === 'red' ? 'bg-red-600' : chip.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'}`}
            >
              {chip.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hand;