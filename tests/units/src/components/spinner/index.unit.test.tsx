import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/spinner';

describe('Spinner Component', () => {
  it('should render without crashing', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should have the correct CSS class', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement).toHaveClass(/spinner/);
  });

  it('should render as a div element', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement.tagName).toBe('DIV');
  });

  it('should be visible in the DOM', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeVisible();
  });

  it('should not contain any text content', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement.textContent).toBe('');
  });

  it('should have only one child element', () => {
    const { container } = render(<Spinner />);
    expect(container.children).toHaveLength(1);
  });
});
