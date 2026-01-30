import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';

const RouteGuard = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
export default RouteGuard;
