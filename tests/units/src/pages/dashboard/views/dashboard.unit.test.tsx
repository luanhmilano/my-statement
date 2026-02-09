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

vi.mock('@/pages/dashboard/views/statement.view', () => ({
  default: () => <div data-testid="statement-view">StatementView</div>,
}));

vi.mock('@/pages/dashboard/views/profile.view', () => ({
  default: () => <div data-testid="profile-view">ProfileView</div>,
}));

vi.mock('@/pages/dashboard/styles/dashboard.module.css', () => ({
  default: {
    container: 'container',
    sideMenu: 'sideMenu',
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
      expect(screen.queryByTestId('statement-view')).not.toBeInTheDocument();
      expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();
    });

    it('renders StatementView when activeView is "statement"', () => {
      render(<DashboardView {...mockProps} activeView="statement" />);

      expect(screen.getByTestId('statement-view')).toBeInTheDocument();
      expect(screen.queryByTestId('home-view')).not.toBeInTheDocument();
      expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();
    });

    it('renders ProfileView when activeView is "profile"', () => {
      render(<DashboardView {...mockProps} activeView="profile" />);

      expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      expect(screen.queryByTestId('home-view')).not.toBeInTheDocument();
      expect(screen.queryByTestId('statement-view')).not.toBeInTheDocument();
    });

    it('renders HomeView as default for unknown activeView', () => {
      render(<DashboardView {...mockProps} activeView={'unknown' as any} />);

      expect(screen.getByTestId('home-view')).toBeInTheDocument();
    });
  });

  describe('Mobile vs Desktop layout', () => {
    it('renders desktop layout when isMobile is false', () => {
      render(<DashboardView {...mockProps} isMobile={false} />);

      const sidemenus = screen.getAllByTestId('side-menu');
      expect(sidemenus).toHaveLength(1);
    });

    it('renders mobile layout when isMobile is true', () => {
      render(
        <DashboardView {...mockProps} isMobile={true} isMobileMenuOpen={true} />
      );

      const sidemenus = screen.getAllByTestId('side-menu');
      expect(sidemenus).toHaveLength(1);
      expect(sidemenus[0]).toHaveAttribute('data-ismobile', 'true');
      expect(sidemenus[0]).toHaveAttribute('data-isopen', 'true');
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

    it('passes mobile-specific props to SideMenu when isMobile is true', () => {
      render(
        <DashboardView {...mockProps} isMobile={true} isMobileMenuOpen={true} />
      );

      const sidemenu = screen.getByTestId('side-menu');
      expect(sidemenu).toHaveAttribute('data-ismobile', 'true');
      expect(sidemenu).toHaveAttribute('data-isopen', 'true');
    });
  });

  describe('CSS classes', () => {
    it('applies correct CSS classes to elements', () => {
      const { container } = render(<DashboardView {...mockProps} />);

      expect(container.firstChild).toHaveClass('container');
      expect(
        screen.getByTestId('header').closest('.mainContent')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('home-view').closest('.main')
      ).toBeInTheDocument();
    });

    it('applies sideMenu class for desktop layout', () => {
      const { container } = render(
        <DashboardView {...mockProps} isMobile={false} />
      );

      expect(container.querySelector('.sideMenu')).toBeInTheDocument();
    });

    it('does not apply sideMenu class wrapper for mobile layout', () => {
      const { container } = render(
        <DashboardView {...mockProps} isMobile={true} />
      );

      expect(container.querySelector('.sideMenu')).not.toBeInTheDocument();
    });
  });
});
