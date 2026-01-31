import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { LoginFormProps } from '@/pages/login/types';
import LoginView from '@/pages/login/view/login.view';

vi.mock('@/pages/login/view/styles/login.module.css', () => ({
  default: {
    container: 'container',
    leftSide: 'leftSide',
    rightSide: 'rightSide',
    logo: 'logo',
    mainImage: 'mainImage',
    formContainer: 'formContainer',
  },
}));

vi.mock('@assets/my_statement-logo.png', () => ({
  default: 'mocked-logo.png',
}));

vi.mock('@assets/login-register-image.png', () => ({
  default: 'mocked-main-image.png',
}));

describe('LoginView', () => {
  const mockProps: LoginFormProps = {
    onSubmit: vi.fn(),
    isLoading: false,
    register: vi.fn(),
    handleSubmit: vi.fn(),
    errors: {},
    navigate: vi.fn(),
  };

  it('should render the main container with correct structure', () => {
    render(<LoginView {...mockProps} />);

    const container =
      screen.getByTestId('login-container') || screen.getByRole('main');
    expect(container).toHaveClass(/container/);
  });

  it('should render left side with logo and main image', () => {
    render(<LoginView {...mockProps} />);

    const logoImage = screen.getByRole('img', { name: 'Logo' });
    const mainImage = screen.getByRole('img', { name: 'Main' });

    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mocked-logo.png');
    expect(logoImage).toHaveClass(/logo/);

    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'mocked-main-image.png');
    expect(mainImage).toHaveClass(/mainImage/);
  });

  it('should render LoginForm with all props', () => {
    render(<LoginView {...mockProps} />);

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();

    expect(screen.getByTestId('navigate-register-button')).toHaveTextContent(
      'Create account'
    );
    expect(screen.getByTestId('login-submit-button')).toHaveTextContent(
      'Log in'
    );
  });

  it('should pass isLoading true to LoginForm', () => {
    const propsWithLoading = { ...mockProps, isLoading: true };
    render(<LoginView {...propsWithLoading} />);

    expect(screen.getByTestId('login-submit-button')).not.toHaveTextContent(
      'Log in'
    );
  });

  it('should render with correct structure and classes', () => {
    const { container } = render(<LoginView {...mockProps} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeTruthy();
    expect(mainContainer.className).toMatch(/container/);

    const logoImage = screen.getByRole('img', { name: 'Logo' });
    const mainImage = screen.getByRole('img', { name: 'Main' });

    expect(logoImage).toHaveClass(/logo/);
    expect(mainImage).toHaveClass(/mainImage/);

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });
});
