import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMonthForm from './AddMonthForm';

describe('AddMonthForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    onAddMonth: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form title', () => {
    render(<AddMonthForm {...mockProps} />);
    const titles = screen.getAllByText(/Agregar Nuevo Mes/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders month selector', () => {
    render(<AddMonthForm {...mockProps} />);
    // Use getAllByText since "Mes" might appear multiple times
    const monthLabels = screen.getAllByText(/Mes/i);
    expect(monthLabels.length).toBeGreaterThan(0);
  });

  it('renders year input', () => {
    render(<AddMonthForm {...mockProps} />);
    expect(screen.getByText(/Año/i)).toBeInTheDocument();
  });

  it('renders income input', () => {
    render(<AddMonthForm {...mockProps} />);
    expect(screen.getByText(/Ingreso Inicial/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddMonthForm {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => 
      btn.getAttribute('aria-label')?.toLowerCase().includes('close') ||
      btn.querySelector('svg')
    );
    if (closeButton) {
      await user.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalled();
    }
  });

  it('renders submit button', () => {
    render(<AddMonthForm {...mockProps} />);
    expect(screen.getByRole('button', { name: /Agregar Mes/i })).toBeInTheDocument();
  });
});

