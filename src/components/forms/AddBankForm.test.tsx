import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBankForm from './AddBankForm';

describe('AddBankForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    onAddBank: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form title', () => {
    render(<AddBankForm {...mockProps} />);
    const titles = screen.getAllByText(/Agregar Banco/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders name input', () => {
    render(<AddBankForm {...mockProps} />);
    const labels = screen.getAllByText(/Nombre del Banco/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders color selector', () => {
    render(<AddBankForm {...mockProps} />);
    expect(screen.getByText(/Color/i)).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<AddBankForm {...mockProps} />);
    // Look for button with X icon (lucide-react X component)
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => btn.querySelector('svg'));
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddBankForm {...mockProps} />);
    const buttons = screen.getAllByRole('button');
    // Find the button with SVG (X icon) that's not the submit button
    const closeButton = buttons.find(btn => {
      const hasSvg = btn.querySelector('svg');
      const isSubmit = btn.textContent?.includes('Agregar');
      return hasSvg && !isSubmit;
    });
    if (closeButton) {
      await user.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalled();
    } else {
      // Fallback: try clicking first button with SVG
      const svgButton = buttons.find(btn => btn.querySelector('svg'));
      if (svgButton) {
        await user.click(svgButton);
        expect(mockProps.onClose).toHaveBeenCalled();
      }
    }
  });

  it('renders submit button', () => {
    render(<AddBankForm {...mockProps} />);
    expect(screen.getByRole('button', { name: /Agregar Banco/i })).toBeInTheDocument();
  });
});

