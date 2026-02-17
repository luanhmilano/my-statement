import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileView from '@/pages/dashboard/views/profile.view';
import type { ProfileViewProps } from '@/pages/dashboard/types';

vi.mock('@/pages/dashboard/styles/profile.module.css', () => ({
  default: {
    container: 'container',
    sideMenu: 'sideMenu',
    menuNav: 'menuNav',
    menuItem: 'menuItem',
    menuItemActive: 'menuItemActive',
    menuLabel: 'menuLabel',
    mainContent: 'mainContent',
    profileContent: 'profileContent',
  },
}));

// Mock EditProfileView component
vi.mock('@/pages/dashboard/views/edit-profile.view', () => ({
  default: () => <div data-testid="edit-profile-view">Edit Profile View</div>,
}));

describe('ProfileView', () => {
  const mockOnNavigate = vi.fn();

  const defaultProps: ProfileViewProps = {
    activeView: 'edit',
    onNavigate: mockOnNavigate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<ProfileView {...defaultProps} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-view')).toBeInTheDocument();
  });

  describe('Menu items', () => {
    it('renders all menu items with correct labels', () => {
      render(<ProfileView {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      const preferencesButton = screen.getByRole('button', {
        name: 'Preferences',
      });
      const securityButton = screen.getByRole('button', { name: 'Security' });

      expect(editButton).toBeInTheDocument();
      expect(preferencesButton).toBeInTheDocument();
      expect(securityButton).toBeInTheDocument();
    });
  });

  describe('Active menu states', () => {
    it('applies active class to edit when it is active', () => {
      render(<ProfileView {...defaultProps} activeView="edit" />);

      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      const preferencesButton = screen.getByRole('button', {
        name: 'Preferences',
      });
      const securityButton = screen.getByRole('button', { name: 'Security' });

      expect(editButton).toHaveClass('menuItem', 'menuItemActive');
      expect(preferencesButton).toHaveClass('menuItem');
      expect(preferencesButton).not.toHaveClass('menuItemActive');
      expect(securityButton).toHaveClass('menuItem');
      expect(securityButton).not.toHaveClass('menuItemActive');
    });

    it('applies active class to preferences when it is active', () => {
      render(<ProfileView {...defaultProps} activeView="preferences" />);

      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      const preferencesButton = screen.getByRole('button', {
        name: 'Preferences',
      });
      const securityButton = screen.getByRole('button', { name: 'Security' });

      expect(preferencesButton).toHaveClass('menuItem', 'menuItemActive');
      expect(editButton).toHaveClass('menuItem');
      expect(editButton).not.toHaveClass('menuItemActive');
      expect(securityButton).toHaveClass('menuItem');
      expect(securityButton).not.toHaveClass('menuItemActive');
    });

    it('applies active class to security when it is active', () => {
      render(<ProfileView {...defaultProps} activeView="security" />);

      const securityButton = screen.getByRole('button', { name: 'Security' });
      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      const preferencesButton = screen.getByRole('button', {
        name: 'Preferences',
      });

      expect(securityButton).toHaveClass('menuItem', 'menuItemActive');
      expect(editButton).toHaveClass('menuItem');
      expect(editButton).not.toHaveClass('menuItemActive');
      expect(preferencesButton).toHaveClass('menuItem');
      expect(preferencesButton).not.toHaveClass('menuItemActive');
    });
  });

  describe('Navigation functionality', () => {
    it('calls onNavigate with correct id when edit menu item is clicked', () => {
      render(<ProfileView {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      fireEvent.click(editButton);

      expect(mockOnNavigate).toHaveBeenCalledWith('edit');
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });

    it('calls onNavigate with correct id when preferences menu item is clicked', () => {
      render(<ProfileView {...defaultProps} />);

      const preferencesButton = screen.getByRole('button', {
        name: 'Preferences',
      });
      fireEvent.click(preferencesButton);

      expect(mockOnNavigate).toHaveBeenCalledWith('preferences');
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });

    it('calls onNavigate with correct id when security menu item is clicked', () => {
      render(<ProfileView {...defaultProps} />);

      const securityButton = screen.getByRole('button', { name: 'Security' });
      fireEvent.click(securityButton);

      expect(mockOnNavigate).toHaveBeenCalledWith('security');
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });

    it('does not call onNavigate multiple times for single click', () => {
      render(<ProfileView {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      fireEvent.click(editButton);

      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('View rendering', () => {
    it('renders EditProfileView for edit activeView', () => {
      render(<ProfileView {...defaultProps} activeView="edit" />);

      expect(screen.getByTestId('edit-profile-view')).toBeInTheDocument();
    });

    it('renders EditProfileView for preferences activeView', () => {
      render(<ProfileView {...defaultProps} activeView="preferences" />);

      expect(screen.getByTestId('edit-profile-view')).toBeInTheDocument();
    });

    it('renders EditProfileView for security activeView', () => {
      render(<ProfileView {...defaultProps} activeView="security" />);

      expect(screen.getByTestId('edit-profile-view')).toBeInTheDocument();
    });

    it('renders EditProfileView as default for unknown activeView', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<ProfileView {...defaultProps} activeView={'unknown' as any} />);

      expect(screen.getByTestId('edit-profile-view')).toBeInTheDocument();
    });

    it('only renders one view at a time', () => {
      render(<ProfileView {...defaultProps} activeView="edit" />);

      const views = screen.getAllByTestId('edit-profile-view');
      expect(views).toHaveLength(1);
    });
  });

  describe('Layout structure', () => {
    it('applies correct CSS classes to elements', () => {
      const { container } = render(<ProfileView {...defaultProps} />);

      expect(container.firstChild).toHaveClass('container');

      const sideMenu = container.querySelector('.sideMenu');
      expect(sideMenu).toBeInTheDocument();

      const menuNav = container.querySelector('.menuNav');
      expect(menuNav).toBeInTheDocument();

      const mainContent = container.querySelector('.mainContent');
      expect(mainContent).toBeInTheDocument();

      const profileContent = container.querySelector('.profileContent');
      expect(profileContent).toBeInTheDocument();
    });

    it('renders components in correct order', () => {
      const { container } = render(<ProfileView {...defaultProps} />);

      const sideMenu = container.querySelector('.sideMenu');
      const mainContent = container.querySelector('.mainContent');

      expect(sideMenu).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();

      // SideMenu should come before mainContent in DOM
      expect(sideMenu!.compareDocumentPosition(mainContent!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it('renders profile content inside main content wrapper', () => {
      const { container } = render(<ProfileView {...defaultProps} />);

      const mainContent = container.querySelector('.mainContent');
      const profileContent = container.querySelector('.profileContent');

      expect(mainContent?.contains(profileContent!)).toBe(true);
    });

    it('renders navigation inside side menu', () => {
      const { container } = render(<ProfileView {...defaultProps} />);

      const sideMenu = container.querySelector('.sideMenu');
      const menuNav = container.querySelector('.menuNav');

      expect(sideMenu?.contains(menuNav!)).toBe(true);
    });
  });

  describe('Menu items array', () => {
    it('renders correct number of menu items', () => {
      render(<ProfileView {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('maintains menu items order', () => {
      render(<ProfileView {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveTextContent('Edit Profile');
      expect(buttons[1]).toHaveTextContent('Preferences');
      expect(buttons[2]).toHaveTextContent('Security');
    });
  });

  describe('Accessibility', () => {
    it('has accessible navigation landmark', () => {
      render(<ProfileView {...defaultProps} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('all menu items are focusable buttons', () => {
      render(<ProfileView {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });
});
