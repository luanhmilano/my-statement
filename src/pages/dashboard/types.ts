export interface DashboardProps {
  logout: () => void;
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export interface SideMenuProps {
  logout: () => void;
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export type NavigationItem = 'home' | 'profile' | 'statement' | 'settings' | 'notifications';

export interface HeaderProps {
  onToggleMenu?: () => void;
  isMobile?: boolean;
}
