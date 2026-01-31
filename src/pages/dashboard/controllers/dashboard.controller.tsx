import { useAuth } from '@/auth/hooks/useAuth';
import DashboardView from '../views/dashboard.view';
import type { NavigationItem } from '../types';
import { useEffect, useState } from 'react';

export default function DashboardController() {
  const [activeView, setActiveView] = useState<NavigationItem>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (view: NavigationItem) => {
    setActiveView(view);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardView 
      logout={logout} 
      activeView={activeView}
      onNavigate={handleNavigate}
      isMobile={isMobile}
      isMobileMenuOpen={isMobileMenuOpen}
      onToggleMobileMenu={toggleMobileMenu}
    />
  );
}
