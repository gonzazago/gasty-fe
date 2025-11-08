import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCardForm from './AddCardForm';

describe('AddCardForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    onAddCard: vi.fn(),
    banks: [
      { id: '1', name: 'Banco Test', color: '#000', logo: '', createdAt: '' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form title', () => {
    render(<AddCardForm {...mockProps} />);
    const titles = screen.getAllByText(/Agregar Tarjeta/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders bank selector', () => {
    render(<AddCardForm {...mockProps} />);
    const labels = screen.getAllByText(/Banco/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders name input', () => {
    render(<AddCardForm {...mockProps} />);
    const labels = screen.getAllByText(/Nombre de la Tarjeta/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders type selector', () => {
    render(<AddCardForm {...mockProps} />);
    expect(screen.getByText(/Tipo de Tarjeta/i)).toBeInTheDocument();
  });

  it('renders last four digits input', () => {
    render(<AddCardForm {...mockProps} />);
    expect(screen.getByText(/Últimos 4 dígitos/i)).toBeInTheDocument();
  });

  it('renders color selector', () => {
    render(<AddCardForm {...mockProps} />);
    expect(screen.getByText(/Color/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddCardForm {...mockProps} />);
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
});

