import { useAuth } from '@/auth/hooks/useAuth';
import DashboardView from '../view/dashboard.view';

export default function DashboardController() {
  const { logout } = useAuth();

  return <DashboardView logout={logout} />;
}
