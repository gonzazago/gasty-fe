import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe('Header', () => {
  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onOpenAddExpense: vi.fn(),
    onOpenAddMonth: vi.fn(),
    isDashboardRoute: false,
    onToggleSidebar: vi.fn()
  };

  it('renders title correctly', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle correctly', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders menu toggle button', () => {
    render(<Header {...mockProps} />);
    const menuButton = screen.getByLabelText('Abrir/cerrar menú');
    expect(menuButton).toBeInTheDocument();
  });

  it('calls onToggleSidebar when menu button is clicked', () => {
    const onToggleSidebar = vi.fn();
    render(<Header {...mockProps} onToggleSidebar={onToggleSidebar} />);
    const menuButton = screen.getByLabelText('Abrir/cerrar menú');
    menuButton.click();
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it('renders HeaderActions component', () => {
    render(<Header {...mockProps} />);
    // HeaderActions should render action buttons
    const addButtons = screen.getAllByText(/Agregar/i);
    expect(addButtons.length).toBeGreaterThan(0);
  });
});

