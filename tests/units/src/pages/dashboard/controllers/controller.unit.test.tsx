import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import DashboardController from '@/pages/dashboard/index.page';

const mockLogout = vi.fn();
vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout
  })
}));

const mockDashboardView = vi.fn();
vi.mock('@/pages/dashboard/views/dashboard.view', () => {
  return {
    __esModule: true,
    default: vi.fn((props) => {
      mockDashboardView(props);
      return (
        <div data-testid="dashboard-view">
          <button onClick={() => props.onNavigate('statement')}>Navigate to Statement</button>
          <button onClick={props.onToggleMobileMenu}>Toggle Mobile Menu</button>
          <div>Active View: {props.activeView}</div>
          <div>Is Mobile: {props.isMobile.toString()}</div>
          <div>Is Mobile Menu Open: {props.isMobileMenuOpen.toString()}</div>
        </div>
      );
    })
  };
});

const simulateResize = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('DashboardController', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    vi.clearAllMocks();
    originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe('Initial state', () => {
    it('initializes with correct default values', () => {
      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith({
        logout: mockLogout,
        activeView: 'home',
        onNavigate: expect.any(Function),
        isMobile: false,
        isMobileMenuOpen: false,
        onToggleMobileMenu: expect.any(Function)
      });
    });

    it('displays initial state correctly', () => {
      render(<DashboardController />);

      expect(screen.getByText('Active View: home')).toBeInTheDocument();
      expect(screen.getByText('Is Mobile: false')).toBeInTheDocument();
      expect(screen.getByText('Is Mobile Menu Open: false')).toBeInTheDocument();
    });
  });

  describe('Mobile detection', () => {
    it('detects mobile on initial load when width <= 768', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith(
        expect.objectContaining({
          isMobile: true
        })
      );
    });

    it('detects desktop on initial load when width > 768', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith(
        expect.objectContaining({
          isMobile: false
        })
      );
    });

    it('updates mobile state when window is resized to mobile size', () => {
      render(<DashboardController />);

      act(() => {
        simulateResize(500);
      });

      expect(screen.getByText('Is Mobile: true')).toBeInTheDocument();
    });

    it('updates mobile state when window is resized to desktop size', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<DashboardController />);

      act(() => {
        simulateResize(1200);
      });

      expect(screen.getByText('Is Mobile: false')).toBeInTheDocument();
    });

    it('handles exact boundary case (768px)', () => {
      render(<DashboardController />);

      act(() => {
        simulateResize(768);
      });

      expect(screen.getByText('Is Mobile: true')).toBeInTheDocument();

      act(() => {
        simulateResize(769);
      });

      expect(screen.getByText('Is Mobile: false')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('updates active view when handleNavigate is called', () => {
      render(<DashboardController />);

      fireEvent.click(screen.getByText('Navigate to Statement'));

      expect(screen.getByText('Active View: statement')).toBeInTheDocument();
    });

    it('closes mobile menu when navigating on mobile device', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<DashboardController />);

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Navigate to Statement'));

      expect(screen.getByText('Active View: statement')).toBeInTheDocument();
      expect(screen.getByText('Is Mobile Menu Open: false')).toBeInTheDocument();
    });

    it('does not close mobile menu when navigating on desktop', () => {
      render(<DashboardController />);

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Navigate to Statement'));

      expect(screen.getByText('Active View: statement')).toBeInTheDocument();
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();
    });
  });

  describe('Mobile menu toggle', () => {
    it('toggles mobile menu from closed to open', () => {
      render(<DashboardController />);

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));

      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();
    });

    it('toggles mobile menu from open to closed', () => {
      render(<DashboardController />);

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: false')).toBeInTheDocument();
    });

    it('can toggle mobile menu multiple times', () => {
      render(<DashboardController />);

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: false')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      expect(screen.getByText('Is Mobile Menu Open: true')).toBeInTheDocument();
    });
  });

  describe('Event listener cleanup', () => {
    it('removes resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<DashboardController />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('adds resize event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      render(<DashboardController />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Props integration', () => {
    it('passes logout function from useAuth', () => {
      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith(
        expect.objectContaining({
          logout: mockLogout
        })
      );
    });

    it('passes all required props to DashboardView', () => {
      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith({
        logout: expect.any(Function),
        activeView: expect.any(String),
        onNavigate: expect.any(Function),
        isMobile: expect.any(Boolean),
        isMobileMenuOpen: expect.any(Boolean),
        onToggleMobileMenu: expect.any(Function)
      });
    });

    it('updates props when state changes', () => {
      render(<DashboardController />);

      expect(mockDashboardView).toHaveBeenCalledWith(
        expect.objectContaining({
          activeView: 'home',
          isMobileMenuOpen: false
        })
      );

      fireEvent.click(screen.getByText('Toggle Mobile Menu'));
      fireEvent.click(screen.getByText('Navigate to Statement'));

      expect(mockDashboardView).toHaveBeenCalledWith(
        expect.objectContaining({
          activeView: 'statement',
          isMobileMenuOpen: true
        })
      );
    });
  });
});
