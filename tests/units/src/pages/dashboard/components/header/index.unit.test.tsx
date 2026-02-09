import Header from '@/pages/dashboard/components/header';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../styles/header.module.css', () => ({
  default: {
    container: 'container',
    menuButton: 'menuButton',
    menuIcon: 'menuIcon',
    searchContainer: 'searchContainer',
    searchInputWrapper: 'searchInputWrapper',
    searchIcon: 'searchIcon',
    searchInput: 'searchInput',
    iconContainer: 'iconContainer',
    iconButton: 'iconButton',
    icon: 'icon',
  },
}));

vi.mock('react-icons/lu', () => ({
  LuCircleUser: () => <div data-testid="user-icon">LuCircleUser</div>,
  LuSettings: () => <div data-testid="settings-icon">LuSettings</div>,
  LuBell: () => <div data-testid="bell-icon">LuBell</div>,
  LuSearch: () => <div data-testid="search-icon">LuSearch</div>,
  LuMenu: () => <div data-testid="menu-icon">LuMenu</div>,
}));

describe('Header Component', () => {
  const mockOnToggleMenu = vi.fn();

  beforeEach(() => {
    mockOnToggleMenu.mockClear();
  });

  it('should render without errors', () => {
    expect(() =>
      render(<Header onToggleMenu={mockOnToggleMenu} />)
    ).not.toThrow();
  });

  it('should render search container always', () => {
    render(<Header onToggleMenu={mockOnToggleMenu} />);

    expect(screen.getByPlaceholderText('Search something')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  describe('Mobile mode', () => {
    it('should render mobile menu button when isMobile is true', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={true} />);

      const menuButton = screen.getByRole('button', { name: 'Open menu' });
      expect(menuButton).toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should not render desktop icon container when isMobile is true', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={true} />);

      expect(
        screen.queryByRole('button', { name: 'Open settings' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Open notifications' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Open user menu' })
      ).not.toBeInTheDocument();
    });

    it('should call onToggleMenu when menu button is clicked', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={true} />);

      const menuButton = screen.getByRole('button', { name: 'Open menu' });
      fireEvent.click(menuButton);

      expect(mockOnToggleMenu).toHaveBeenCalledTimes(1);
    });
  });

  describe('Desktop mode', () => {
    it('should not render mobile menu button when isMobile is false', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={false} />);

      expect(
        screen.queryByRole('button', { name: 'Open menu' })
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();
    });

    it('should render desktop icon container when isMobile is false', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={false} />);

      expect(
        screen.getByRole('button', { name: 'Open settings' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open notifications' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open user menu' })
      ).toBeInTheDocument();
    });

    it('should render all desktop icons', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={false} />);

      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });

  describe('Default props', () => {
    it('should default to desktop mode when isMobile is not provided', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} />);

      expect(
        screen.queryByRole('button', { name: 'Open menu' })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open settings' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open notifications' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open user menu' })
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels for all buttons', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={true} />);

      expect(
        screen.getByRole('button', { name: 'Open menu' })
      ).toBeInTheDocument();
    });

    it('should have proper aria-labels for desktop buttons', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} isMobile={false} />);

      expect(
        screen.getByRole('button', { name: 'Open settings' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open notifications' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Open user menu' })
      ).toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should render search input with correct placeholder', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} />);

      const searchInput = screen.getByPlaceholderText('Search something');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should render search icon', () => {
      render(<Header onToggleMenu={mockOnToggleMenu} />);

      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
  });
});
