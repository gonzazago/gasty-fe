import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddExpenseForm from './AddExpenseForm';

describe('AddExpenseForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    onAddExpense: vi.fn(),
    banks: [],
    cards: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form title', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByRole('heading', { name: /Agregar Gasto/i })).toBeInTheDocument();
  });

  it('renders amount input', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByLabelText(/Monto/i)).toBeInTheDocument();
  });

  it('renders description input', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
  });

  it('renders category select', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
  });

  it('renders date picker', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByLabelText(/Fecha/i)).toBeInTheDocument();
  });

  it('renders bank/card select', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByLabelText(/Banco o Tarjeta/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm {...mockProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('renders submit button', () => {
    render(<AddExpenseForm {...mockProps} />);
    expect(screen.getByRole('button', { name: /Agregar Gasto/i })).toBeInTheDocument();
  });
});
