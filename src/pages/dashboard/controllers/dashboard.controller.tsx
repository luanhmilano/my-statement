import { useAuth } from '@/auth/hooks/useAuth';
import DashboardView from '../views/dashboard.view';
import type { NavigationItem } from '../types';
import { useState } from 'react';

export default function DashboardController() {
  const [activeView, setActiveView] = useState<NavigationItem>('home');
  const { logout } = useAuth();

  const handleNavigate = (view: NavigationItem) => {
    setActiveView(view);
  };

  return (
    <DashboardView 
      logout={logout} 
      activeView={activeView}
      onNavigate={handleNavigate}
    />
  );
}
