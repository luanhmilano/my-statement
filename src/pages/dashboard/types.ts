export interface DashboardProps {
  logout: () => void;
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
}

export interface SideMenuProps {
  logout: () => void;
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
}

export type NavigationItem = 'home' | 'profile' | 'statement' | 'settings' | 'notifications';
