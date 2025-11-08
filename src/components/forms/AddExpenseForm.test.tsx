import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddExpenseForm from './AddExpenseForm';

// Mock de las acciones
vi.mock('@/actions/expenses', () => ({
  addExpense: vi.fn()
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe('AddExpenseForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    cards: [
      { id: '1', name: 'Visa', lastFourDigits: '1234', bankId: '1', type: 'visa' as const, color: '#000', createdAt: '' }
    ],
    months: [
      { id: 'month-1', month: 'Enero 2024' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form title', () => {
    render(<AddExpenseForm {...mockProps} />);
    const titles = screen.getAllByText('Agregar Gasto');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders close button', () => {
    render(<AddExpenseForm {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => 
      btn.getAttribute('aria-label')?.toLowerCase().includes('close') ||
      btn.querySelector('svg')
    );
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm {...mockProps} />);
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

  it('renders month selector', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByText('Asignar al Mes *')).toBeInTheDocument();
  });

  it('renders category selector', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByText('Categoría *')).toBeInTheDocument();
  });

  it('renders place input', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByText('Lugar/Descripción *')).toBeInTheDocument();
  });

  it('renders amount input', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByText(/Monto/)).toBeInTheDocument();
  });

  it('renders date input', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByText('Fecha *')).toBeInTheDocument();
  });

  it('shows card selector when category is Tarjetas', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm {...mockProps} />);
    
    const categorySelect = screen.getByLabelText('Categoría *');
    await user.selectOptions(categorySelect, 'Tarjetas');
    
    await waitFor(() => {
      expect(screen.getByText('¿Qué tarjeta estás pagando? *')).toBeInTheDocument();
    });
  });

  it('shows installments fields when checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm {...mockProps} />);
    
    const checkbox = screen.getByLabelText(/Es un gasto en cuotas/);
    await user.click(checkbox);
    
    await waitFor(() => {
      expect(screen.getByText('Cuota Actual *')).toBeInTheDocument();
      expect(screen.getByText('Total de Cuotas *')).toBeInTheDocument();
    });
  });
});

