import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { token } = useAuth();
  
  // Por enquanto, qualquer usuário logado pode acessar a área admin
  // Posteriormente, você pode adicionar verificação de nível de acesso aqui
  // Por exemplo: verificar se o usuário tem role 'admin'
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
