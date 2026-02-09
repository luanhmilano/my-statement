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

export type NavigationItem =
  | 'home'
  | 'profile'
  | 'statement'
  | 'settings'
  | 'notifications';

export interface HeaderProps {
  onToggleMenu?: () => void;
  isMobile?: boolean;
}

export interface BalanceTopProps {
  icon?: React.ComponentType;
  title: string;
  amount: number;
  type: 'money' | 'expenses' | 'earnings' | 'default';
}

export interface StatementItem {
  id: number;
  description: string;
  type: 'Withdrawal' | 'Transfer' | 'Deposit';
  date: string;
  amount: number;
  card: string;
}

export interface StatementViewProps {
  data: StatementItem[];
  balanceTotal: {
    balance: number;
    expenses: number;
    earnings: number;
  };
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export interface PaginatedTableProps {
  data: StatementItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
