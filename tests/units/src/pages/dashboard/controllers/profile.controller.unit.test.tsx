import ProfileController from '@/pages/dashboard/controllers/profile.controller';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/pages/dashboard/views/profile.view', () => ({
  default: vi.fn(({ activeView, onNavigate }) => (
    <div data-testid="profile-view">
      <span data-testid="active-view">{activeView}</span>
      <button data-testid="nav-personal" onClick={() => onNavigate('personal')}>
        Navigate to Personal
      </button>
      <button
        data-testid="nav-preferences"
        onClick={() => onNavigate('preferences')}
      >
        Navigate to Preferences
      </button>
      <button data-testid="nav-security" onClick={() => onNavigate('security')}>
        Navigate to Security
      </button>
    </div>
  )),
}));

describe('ProfileController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default activeView as "edit"', () => {
    render(<ProfileController />);

    expect(screen.getByTestId('active-view')).toHaveTextContent('edit');
  });

  it('should update activeView when handleNavigate is called', () => {
    render(<ProfileController />);

    expect(screen.getByTestId('active-view')).toHaveTextContent('edit');

    fireEvent.click(screen.getByTestId('nav-preferences'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('preferences');

    fireEvent.click(screen.getByTestId('nav-security'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('security');
  });

  it('should handle multiple navigation calls correctly', () => {
    render(<ProfileController />);

    fireEvent.click(screen.getByTestId('nav-personal'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('personal');

    fireEvent.click(screen.getByTestId('nav-security'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('security');

    fireEvent.click(screen.getByTestId('nav-preferences'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('preferences');
  });
});
