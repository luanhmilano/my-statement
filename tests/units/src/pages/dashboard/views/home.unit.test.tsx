import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeView from '@/pages/dashboard/views/home.view';

vi.mock('@assets/dashboard-image.png', () => ({
  default: 'mocked-dashboard-image.png'
}));

vi.mock('@/pages/dashboard/styles/home.module.css', () => ({
  default: {
    container: 'container',
    image: 'image'
  }
}));

describe('HomeView', () => {
  it('renders correctly', () => {
    render(<HomeView />);
    
    expect(screen.getByRole('img', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders image with correct attributes', () => {
    render(<HomeView />);
    
    const image = screen.getByRole('img', { name: 'Dashboard' });
    expect(image).toHaveAttribute('src', 'mocked-dashboard-image.png');
    expect(image).toHaveAttribute('alt', 'Dashboard');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<HomeView />);
    
    expect(container.firstChild).toHaveClass('container');
    expect(screen.getByRole('img')).toHaveClass('image');
  });
});