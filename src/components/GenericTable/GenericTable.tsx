'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor: string | ((item: T) => unknown);
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
}

interface GenericTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export default function GenericTable<T = Record<string, unknown>>({ columns, data, className = '' }: GenericTableProps<T>) {
  const renderCell = (column: Column<T>, item: T) => {
    let value;
    
    if (typeof column.accessor === 'function') {
      value = column.accessor(item);
    } else {
      value = item[column.accessor];
    }

    if (column.render) {
      return column.render(value, item);
    }

    return value;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-sm font-medium text-gray-900 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                >
                  {renderCell(column, item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente específico para mostrar variaciones
export function VariationCell({ value }: { value: number | undefined }) {
  // Si no hay variación (undefined), mostrar guión
  if (value === undefined) {
    return <span className="text-gray-500">-</span>;
  }
  
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <div className={`flex items-center space-x-1 ${isPositive ? 'text-red-600' : isNegative ? 'text-green-600' : 'text-gray-600'}`}>
      {isPositive ? (
        <ChevronUp className="w-4 h-4" />
      ) : isNegative ? (
        <ChevronDown className="w-4 h-4" />
      ) : null}
      <span className="font-medium">
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
    </div>
  );
}

// Componente para mostrar cuotas
export function InstallmentsCell({ split }: { split: { current: number; total: number; lefts: number } | null }) {
  if (!split) return <span className="text-gray-500">-</span>;
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm">{split.current}/{split.total}</span>
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full" 
          style={{ width: `${(split.current / split.total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Componente para mostrar estado fijo/variable
export function FixedCell({ fixed }: { fixed: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      fixed 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-orange-100 text-orange-800'
    }`}>
      {fixed ? 'Fijo' : 'Variable'}
    </span>
  );
}
