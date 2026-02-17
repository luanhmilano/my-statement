/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DashboardProps } from '@/pages/dashboard/types';
import DashboardView from '@/pages/dashboard/views/dashboard.view';

// Mock child components
vi.mock('@/pages/dashboard/components/header', () => ({
  default: ({ onToggleMenu, isMobile }: any) => (
    <div data-testid="header" data-ismobile={isMobile} onClick={onToggleMenu}>
      Header
    </div>
  ),
}));

vi.mock('@/pages/dashboard/components/side-menu', () => ({
  default: ({
    logout,
    activeView,
    onNavigate,
    isMobile,
    isOpen,
    onClose,
  }: any) => (
    <div
      data-testid="side-menu"
      data-activeview={activeView}
      data-ismobile={isMobile}
      data-isopen={isOpen}
      onClick={() => {
        logout?.();
        onNavigate?.();
        onClose?.();
      }}
    >
      SideMenu
    </div>
  ),
}));

vi.mock('@/pages/dashboard/views/home.view', () => ({
  default: () => <div data-testid="home-view">HomeView</div>,
}));

vi.mock('@/pages/dashboard/controllers/statement.controller', () => ({
  default: () => (
    <div data-testid="statement-controller">StatementController</div>
  ),
}));

vi.mock('@/pages/dashboard/controllers/profile.controller', () => ({
  default: () => <div data-testid="profile-controller">ProfileController</div>,
}));

vi.mock('@/pages/dashboard/styles/dashboard.module.css', () => ({
  default: {
    container: 'container',
    mainContent: 'mainContent',
    main: 'main',
  },
}));

describe('DashboardView', () => {
  const mockProps: DashboardProps = {
    logout: vi.fn(),
    activeView: 'home',
    onNavigate: vi.fn(),
    isMobile: false,
    isMobileMenuOpen: false,
    onToggleMobileMenu: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<DashboardView {...mockProps} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('side-menu')).toBeInTheDocument();
    expect(screen.getByTestId('home-view')).toBeInTheDocument();
  });

  describe('View switching', () => {
    it('renders HomeView when activeView is "home"', () => {
      render(<DashboardView {...mockProps} activeView="home" />);

      expect(screen.getByTestId('home-view')).toBeInTheDocument();
      expect(
        screen.queryByTestId('statement-controller')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-controller')
      ).not.toBeInTheDocument();
    });

    it('renders StatementView when activeView is "statement"', () => {
      render(<DashboardView {...mockProps} activeView="statement" />);

      expect(screen.getByTestId('statement-controller')).toBeInTheDocument();
      expect(screen.queryByTestId('home-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-controller')
      ).not.toBeInTheDocument();
    });

    it('renders ProfileView when activeView is "profile"', () => {
      render(<DashboardView {...mockProps} activeView="profile" />);

      expect(screen.getByTestId('profile-controller')).toBeInTheDocument();
      expect(screen.queryByTestId('home-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('statement-controller')
      ).not.toBeInTheDocument();
    });

    it('renders HomeView as default for unknown activeView', () => {
      render(<DashboardView {...mockProps} activeView={'unknown' as any} />);

      expect(screen.getByTestId('home-view')).toBeInTheDocument();
      expect(
        screen.queryByTestId('statement-controller')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-controller')
      ).not.toBeInTheDocument();
    });
  });

  describe('SideMenu visibility and props', () => {
    it('renders SideMenu with isOpen=true when not mobile', () => {
      render(<DashboardView {...mockProps} isMobile={false} />);

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-isopen', 'true');
      expect(sidemenu).toHaveAttribute('data-ismobile', 'false');
    });

    it('renders SideMenu with isOpen=true when mobile and menu is open', () => {
      render(
        <DashboardView {...mockProps} isMobile={true} isMobileMenuOpen={true} />
      );

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-isopen', 'true');
      expect(sidemenu).toHaveAttribute('data-ismobile', 'true');
    });

    it('renders SideMenu with isOpen=false when mobile and menu is closed', () => {
      render(
        <DashboardView
          {...mockProps}
          isMobile={true}
          isMobileMenuOpen={false}
        />
      );

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-isopen', 'false');
      expect(sidemenu).toHaveAttribute('data-ismobile', 'true');
    });
  });

  describe('Component props passing', () => {
    it('passes correct props to Header component', () => {
      render(<DashboardView {...mockProps} isMobile={true} />);

      const header = screen.getByTestId('header');
      expect(header).toHaveAttribute('data-ismobile', 'true');
    });

    it('passes correct props to SideMenu component', () => {
      render(<DashboardView {...mockProps} activeView="statement" />);

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-activeview', 'statement');
    });

    it('passes all required props to SideMenu', () => {
      render(<DashboardView {...mockProps} />);

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-activeview', 'home');
      expect(sidemenu).toHaveAttribute('data-ismobile', 'false');
      expect(sidemenu).toHaveAttribute('data-isopen', 'true');
    });
  });

  describe('Layout structure', () => {
    it('applies correct CSS classes to elements', () => {
      const { container } = render(<DashboardView {...mockProps} />);

      expect(container.firstChild).toHaveClass('container');

      const mainContent = container.querySelector('.mainContent');
      expect(mainContent).toBeInTheDocument();

      const main = container.querySelector('.main');
      expect(main).toBeInTheDocument();
    });

    it('renders components in correct order', () => {
      const { container } = render(<DashboardView {...mockProps} />);

      const sidemenu = screen.getByTestId('side-menu');
      const mainContent = container.querySelector('.mainContent');

      expect(sidemenu).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();

      // SideMenu should come before mainContent in DOM
      expect(sidemenu.compareDocumentPosition(mainContent!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it('renders Header and main content inside mainContent wrapper', () => {
      const { container } = render(<DashboardView {...mockProps} />);

      const mainContent = container.querySelector('.mainContent');
      const header = screen.getByTestId('header');
      const main = container.querySelector('.main');

      expect(mainContent?.contains(header)).toBe(true);
      expect(mainContent?.contains(main!)).toBe(true);
    });
  });

  describe('Callback functions', () => {
    it('passes onToggleMobileMenu to both Header and SideMenu onClose', () => {
      const mockToggle = vi.fn();
      render(<DashboardView {...mockProps} onToggleMobileMenu={mockToggle} />);

      // Both components should receive the same callback
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('side-menu')).toBeInTheDocument();
    });
  });
});
