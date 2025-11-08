import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { MonthProvider, MonthEntry } from '../NavigationWrapper/MonthContext';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

const mockMonths: MonthEntry[] = [
  { id: 'm1', label: 'Enero 2024' },
  { id: 'm2', label: 'Febrero 2024' },
  { id: 'm3', label: 'Marzo 2024' }
];

function renderWithMonthProvider(ui, { initialIndex = 0 } = {}) {
  return render(
    <MonthProvider monthList={mockMonths} initialIndex={initialIndex}>
      {ui}
    </MonthProvider>
  );
}

describe('Header', () => {
  const mockProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onOpenAddExpense: vi.fn(),
    onOpenAddMonth: vi.fn(),
    isDashboardRoute: false,
    onToggleSidebar: vi.fn(),
  };

  it('renders title correctly', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle correctly', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders menu toggle button', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    const menuButton = screen.getByLabelText('Abrir/cerrar menú');
    expect(menuButton).toBeInTheDocument();
  });

  it('calls onToggleSidebar when menu button is clicked', () => {
    const onToggleSidebar = vi.fn();
    renderWithMonthProvider(<Header {...mockProps} onToggleSidebar={onToggleSidebar} />);
    const menuButton = screen.getByLabelText('Abrir/cerrar menú');
    menuButton.click();
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it('renders HeaderActions component', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    // HeaderActions should render action buttons
    const addButtons = screen.getAllByText(/Agregar/i);
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('renders month select with all months', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    const select = screen.getByLabelText(/Seleccionar mes/i);
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
    // Should have an option for each mock month
    mockMonths.forEach(month => {
      expect(screen.getByText(month.label)).toBeInTheDocument();
    });
  });

  it('can change selected month with dropdown', () => {
    renderWithMonthProvider(<Header {...mockProps} />);
    const select = screen.getByLabelText(/Seleccionar mes/i);
    fireEvent.change(select, { target: { value: '2' }}); // Cambia de mes
    expect((select as HTMLSelectElement).value).toBe('2');
    // Ahora Marzo debe estar seleccionado
    expect(screen.getByText('Marzo 2024')).toBeInTheDocument();
  });
});

