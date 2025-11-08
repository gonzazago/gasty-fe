import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  const mockProps = {
    title: 'Total Gastos',
    value: '$2.850.000',
    currency: 'ARS',
    change: {
      percentage: '3.6%',
      isPositive: false,
      description: 'vs mes anterior'
    },
    details: {
      transactions: 8,
      categories: 3
    }
  };

  it('renders title correctly', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('Total Gastos')).toBeInTheDocument();
  });

  it('renders value correctly', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('$2.850.000')).toBeInTheDocument();
  });

  it('renders currency selector', () => {
    render(<MetricCard {...mockProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('ARS');
  });

  it('renders change percentage', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('3.6%')).toBeInTheDocument();
  });

  it('renders change description', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('vs mes anterior')).toBeInTheDocument();
  });

  it('renders transaction count', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('8 transacciones')).toBeInTheDocument();
  });

  it('renders category count', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('3 categorías')).toBeInTheDocument();
  });

  it('applies positive change styling', () => {
    const positiveProps = {
      ...mockProps,
      change: { ...mockProps.change, isPositive: true }
    };
    render(<MetricCard {...positiveProps} />);
    const changeElement = screen.getByText('3.6%').closest('div');
    expect(changeElement).toHaveClass('text-green-600');
  });

  it('applies negative change styling', () => {
    render(<MetricCard {...mockProps} />);
    const changeElement = screen.getByText('3.6%').closest('div');
    expect(changeElement).toHaveClass('text-red-600');
  });
});

