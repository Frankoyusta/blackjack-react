import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { GameProvider } from './context/GameContext';
import Login from './routes/Login';
import Game from './routes/Game';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  // Verificar si hay un token en localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Redireccionar a login si no hay autenticación
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <GameProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route 
                path="/game" 
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </GameProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
