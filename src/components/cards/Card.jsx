import React from 'react';

const Card = ({ card, hidden = false }) => {

  const getSuitClassName = () => {
    if (card.suit === '♥' || card.suit === '♦') {
      return 'text-red-600';
    }
    return 'text-black';
  };
  
  const getSuitSize = () => {
    return card.suit === '♥' || card.suit === '♠' ? 'text-6xl' : 'text-5xl';
  };
  
  // Centramos el símbolo según su tipo
  const getCenterContent = () => {
    if (card.suit === '♥') {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <div className="text-red-600 text-7xl">♥</div>
        </div>
      );
    } else if (card.suit === '♠') {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <div className="text-black text-7xl">♠</div>
        </div>
      );
    } else if (card.suit === '♦') {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <div className="text-red-600 text-7xl">♦</div>
        </div>
      );
    } else if (card.suit === '♣') {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <div className="text-black text-7xl">♣</div>
        </div>
      );
    }
  };

  return (
    <div className={`relative w-32 h-48 bg-white rounded-lg shadow-md mx-2 ${hidden ? 'bg-gray-700' : ''}`}>
      {!hidden && (
        <div className="w-full h-full p-2 flex flex-col justify-between">
          {/* Esquina superior izquierda */}
          <div className={`absolute top-2 left-2 ${getSuitClassName()}`}>
            <div className="text-xl font-bold">{card.value}</div>
            <div className={`${getSuitSize()} leading-none`}>{card.suit}</div>
          </div>
          
          {/* Símbolo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            {getCenterContent()}
          </div>
          
          {/* Esquina inferior derecha (rotada) */}
          <div className={`absolute bottom-2 right-2 rotate-180 ${getSuitClassName()}`}>
            <div className="text-xl font-bold">{card.value}</div>
            <div className={`${getSuitSize()} leading-none`}>{card.suit}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;