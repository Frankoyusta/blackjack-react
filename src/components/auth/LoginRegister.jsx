import { useState } from 'react';

const LoginRegister = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username,password);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-500 mb-2">Bienvenido al casino del DICSAS</h1>
        <div className="flex justify-center">
          <div className="h-1 w-24 bg-amber-500 rounded"></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-amber-400 mb-2 font-medium">Nombre de Usuario</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-600"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-amber-400 mb-2 font-medium">Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-600"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button 
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none"
          >
            Ingresar
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-3">
          <span className="h-6 w-6 text-red-500">♥</span>
          <span className="h-6 w-6 text-black">♠</span>
          <span className="h-6 w-6 text-red-500">♦</span>
          <span className="h-6 w-6 text-black">♣</span>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;