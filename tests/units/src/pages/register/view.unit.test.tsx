import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RegisterFormProps } from '@/pages/register/types';
import RegisterView from '@/pages/register/view/register.view';

vi.mock('@/pages/register/styles/register.module.css', () => ({
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

vi.mock('@/pages/register/components/register-form', () => ({
  default: vi.fn(({ onSubmit, isLoading, register, handleSubmit, errors }) => (
    <div data-testid="register-form">
      <span data-testid="onSubmit">{typeof onSubmit}</span>
      <span data-testid="isLoading">{isLoading.toString()}</span>
      <span data-testid="register">{typeof register}</span>
      <span data-testid="handleSubmit">{typeof handleSubmit}</span>
      <span data-testid="errors">{typeof errors}</span>
    </div>
  )),
}));

describe('RegisterView', () => {
  const mockProps: RegisterFormProps = {
    onSubmit: vi.fn(),
    isLoading: false,
    register: vi.fn(),
    handleSubmit: vi.fn(),
    errors: {},
  };

  it('should render the main container with correct structure', () => {
    render(<RegisterView {...mockProps} />);

    const container = screen.getByTestId('register-view');
    expect(container).toHaveClass(/container/);
  });

  it('should render left side with logo and main image', () => {
    render(<RegisterView {...mockProps} />);

    const logoImage = screen.getByRole('img', { name: 'Logo' });
    const mainImage = screen.getByRole('img', { name: 'Main' });

    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mocked-logo.png');
    expect(logoImage).toHaveClass(/logo/);

    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'mocked-main-image.png');
    expect(mainImage).toHaveClass(/mainImage/);
  });

  it('should render RegisterForm with all props', () => {
    render(<RegisterView {...mockProps} />);

    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toBeInTheDocument();

    expect(screen.getByTestId('onSubmit')).toHaveTextContent('function');
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
    expect(screen.getByTestId('register')).toHaveTextContent('function');
    expect(screen.getByTestId('handleSubmit')).toHaveTextContent('function');
    expect(screen.getByTestId('errors')).toHaveTextContent('object');
  });

  it('should pass isLoading true to RegisterForm', () => {
    const propsWithLoading = { ...mockProps, isLoading: true };
    render(<RegisterView {...propsWithLoading} />);

    expect(screen.getByTestId('isLoading')).toHaveTextContent('true');
  });

  it('should render with correct structure and classes', () => {
    const { container } = render(<RegisterView {...mockProps} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeTruthy();
    expect(mainContainer.className).toMatch(/container/);

    const logoImage = screen.getByRole('img', { name: 'Logo' });
    const mainImage = screen.getByRole('img', { name: 'Main' });

    expect(logoImage).toHaveClass(/logo/);
    expect(mainImage).toHaveClass(/mainImage/);

    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toBeInTheDocument();
  });

  it('should pass errors object to RegisterForm', () => {
    const propsWithErrors = {
      ...mockProps,
      errors: { email: { message: 'Invalid email', type: 'required' } },
    };
    render(<RegisterView {...propsWithErrors} />);

    expect(screen.getByTestId('errors')).toHaveTextContent('object');
  });
});
