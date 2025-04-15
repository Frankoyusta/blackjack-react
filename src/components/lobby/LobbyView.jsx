import React, { useState } from 'react';

const LobbyView = ({ user, tables, onCreateTable, onJoinTable }) => {
  const [newTableName, setNewTableName] = useState('');

  const handleCreateTable = (e) => {
    e.preventDefault();
    if (newTableName.trim()) {
      onCreateTable(newTableName);
      setNewTableName('');
    }
  };

  return (
    <div className="lobby-container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blackjack Online</h1>
        <div className="text-right">
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-gray-600">RPEREZCoins: {user.coins}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Mesa</h2>
        <form onSubmit={handleCreateTable} className="flex gap-2">
          <input 
            type="text" 
            value={newTableName} 
            onChange={(e) => setNewTableName(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md"
            placeholder="Nombre de la mesa"
            required
          />
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md"
          >
            Crear Mesa
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Mesas Disponibles</h2>
        {tables.length === 0 ? (
          <p className="text-gray-600">No hay mesas disponibles. ¡Crea una nueva!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tables.map(table => (
              <div key={table.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg mb-2">{table.name}</h3>
                <p className="mb-2">Jugadores: {table.players}/{table.maxPlayers}</p>
                <p className="mb-3">Estado: {
                  table.status === 'waiting' ? 'Esperando' :
                  table.status === 'betting' ? 'Apostando' :
                  table.status === 'playing' ? 'Jugando' :
                  'Finalizado'
                }</p>
                <button 
                  onClick={() => onJoinTable(table.id)}
                  disabled={table.players >= table.maxPlayers}
                  className={`px-4 py-2 rounded font-semibold ${
                    table.players >= table.maxPlayers 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {table.players >= table.maxPlayers ? 'Mesa Llena' : 'Unirse'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyView;