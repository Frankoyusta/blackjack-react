import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import LoginRegister from '../components/auth/LoginRegister';
import '../styles/Login.css';

const Login = () => {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();

  // Redirección si el usuario ya está autenticado
  useEffect(() => {
    if (user && !loading) {
      navigate('/game');
    }
  }, [user, loading, navigate]);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-amber-500 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <LoginRegister />
    </div>
  );
};

export default Login;
