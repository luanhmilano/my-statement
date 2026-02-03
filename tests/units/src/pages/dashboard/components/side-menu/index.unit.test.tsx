import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SideMenu from '@/pages/dashboard/components/side-menu';
import type { SideMenuProps } from '@/pages/dashboard/types';

vi.mock('../../styles/side-menu.module.css', () => ({
  default: {
    container: 'container',
    mobileContainer: 'mobileContainer',
    open: 'open',
    overlay: 'overlay',
    closeButton: 'closeButton',
    logo: 'logo',
    menuList: 'menuList',
    menuItem: 'menuItem',
    menuContent: 'menuContent',
    menuIcon: 'menuIcon',
    menuText: 'menuText',
    logoutButton: 'logoutButton'
  }
}));

vi.mock('@assets/my_statement-logo-black.png', () => ({
  default: 'mocked-logo.png'
}));

vi.mock('react-icons/lu', () => ({
  LuHouse: () => <span data-testid="house-icon">House</span>,
  LuCreditCard: () => <span data-testid="credit-card-icon">CreditCard</span>,
  LuCircleUser: () => <span data-testid="circle-user-icon">CircleUser</span>,
  LuSettings: () => <span data-testid="settings-icon">Settings</span>,
  LuBell: () => <span data-testid="bell-icon">Bell</span>,
  LuLogOut: () => <span data-testid="logout-icon">LogOut</span>,
  LuX: () => <span data-testid="x-icon">X</span>
}));

describe('SideMenu', () => {
  const mockProps: SideMenuProps = {
    logout: vi.fn(),
    activeView: 'home',
    onNavigate: vi.fn(),
    isMobile: false,
    isOpen: false,
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders the logo', () => {
      render(<SideMenu {...mockProps} />);
      const logo = screen.getByAltText('My Statement Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-logo.png');
      expect(logo).toHaveAttribute('width', '200');
    });

    it('renders all menu items', () => {
      render(<SideMenu {...mockProps} />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Statement')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('renders menu icons', () => {
      render(<SideMenu {...mockProps} />);
      
      expect(screen.getByTestId('house-icon')).toBeInTheDocument();
      expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
      expect(screen.getByTestId('circle-user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });

    it('renders with proper ARIA labels', () => {
      render(<SideMenu {...mockProps} />);
      
      expect(screen.getByLabelText('Main menu')).toBeInTheDocument();
      expect(screen.getByLabelText('Logout')).toBeInTheDocument();
    });
  });

  describe('Desktop mode', () => {
    it('applies desktop container class', () => {
      render(<SideMenu {...mockProps} />);
      const container = screen.getByRole('list', { name: 'Main menu' }).parentElement;
      expect(container).toHaveClass(/container/);
      expect(container).not.toHaveClass('mobileContainer');
    });

    it('does not render mobile-specific elements', () => {
      render(<SideMenu {...mockProps} />);
      
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
    });

    it('does not render overlay', () => {
      render(<SideMenu {...mockProps} />);
      expect(document.querySelector('.overlay')).not.toBeInTheDocument();
    });
  });

  describe('Mobile mode', () => {
    const mobileProps = { ...mockProps, isMobile: true };

    it('applies mobile container classes when closed', () => {
      render(<SideMenu {...mobileProps} isOpen={false} />);
      const container = screen.getByRole('list', { name: 'Main menu' }).parentElement;
      expect(container).toHaveClass(/container/, /mobileContainer/);
      expect(container).not.toHaveClass('open');
    });

    it('applies open class when mobile menu is open', () => {
      render(<SideMenu {...mobileProps} isOpen={true} />);
      const container = screen.getByRole('list', { name: 'Main menu' }).parentElement;
      expect(container!.className).toMatch(/container/);
      expect(container!.className).toMatch(/mobileContainer/);
      expect(container!.className).toMatch(/open/);
    });

    it('renders close button when mobile', () => {
      render(<SideMenu {...mobileProps} />);
      
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('renders overlay when mobile and open', () => {
      render(<SideMenu {...mobileProps} isOpen={true} />);
      expect(screen.getByTestId('mobile-overlay')).toBeInTheDocument();
    });

    it('does not render overlay when mobile and closed', () => {
      render(<SideMenu {...mobileProps} isOpen={false} />);
      expect(screen.queryByTestId('mobile-overlay')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onNavigate when menu item is clicked', () => {
      render(<SideMenu {...mockProps} />);
      
      fireEvent.click(screen.getByText('Statement'));
      expect(mockProps.onNavigate).toHaveBeenCalledWith('statement');
      
      fireEvent.click(screen.getByText('Profile'));
      expect(mockProps.onNavigate).toHaveBeenCalledWith('profile');
    });

    it('calls logout when logout button is clicked', () => {
      render(<SideMenu {...mockProps} />);
      
      fireEvent.click(screen.getByLabelText('Logout'));
      expect(mockProps.logout).toHaveBeenCalledOnce();
    });

    it('calls onClose when close button is clicked in mobile', () => {
      render(<SideMenu {...mockProps} isMobile={true} />);
      
      fireEvent.click(screen.getByLabelText('Close menu'));
      expect(mockProps.onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when overlay is clicked in mobile', () => {
      render(<SideMenu {...mockProps} isMobile={true} isOpen={true} />);
      
      const overlay = screen.getByTestId('mobile-overlay');
      fireEvent.click(overlay);
      expect(mockProps.onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Active state', () => {
    it('applies selected class to active menu item', () => {
      render(<SideMenu {...mockProps} activeView="statement" />);
      
      const statementButton = screen.getByText('Statement').closest('button');
      expect(statementButton).toHaveClass('selected');
    });

    it('does not apply selected class to inactive menu items', () => {
      render(<SideMenu {...mockProps} activeView="statement" />);
      
      const homeButton = screen.getByText('Home').closest('button');
      const profileButton = screen.getByText('Profile').closest('button');
      
      expect(homeButton).not.toHaveClass('selected');
      expect(profileButton).not.toHaveClass('selected');
    });

    it('inactive menu items have no additional classes', () => {
    render(<SideMenu {...mockProps} activeView="home" />);
    
    const statementButton = screen.getByText('Statement').closest('button');
    expect(statementButton).not.toHaveClass('selected');
    expect(statementButton).toHaveAttribute('class', '');
  });
  });
});
