// src/components/Table/Table.tsx
'use client';

import React, { Fragment } from 'react';
import { Receipt, Plus } from 'lucide-react';

// 1. Definir y EXPORTAR 'Column'
export interface Column<T = Record<string, unknown>> {
    key: string;
    header: string;
    accessor: string | ((item: T) => unknown);
    render?: (value: unknown, item: T) => React.ReactNode; // render recibe (valor, item_completo)
    className?: string;
}

// 2. Definir 'GenericTableProps' UNA SOLA VEZ
interface GenericTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string; // Clave para identificar cada fila
    onRowClick?: (item: T) => void; // Manejador para el clic en la fila
    renderRow?: (item: T, columns: Column<T>[]) => React.ReactNode; // Render custom
}

// --- Helper para obtener el valor ---
function getValue<T>(item: T, column: Column<T>): unknown {
    if (typeof column.accessor === 'function') {
        return (column.accessor as (item: T) => unknown)(item);
    }
    return (item as Record<string, unknown>)[column.accessor as string];
}

// --- Componente Principal ---
export default function GenericTable<T>({
                                            columns,
                                            data,
                                            keyExtractor,
                                            onRowClick,
                                            renderRow
                                        }: GenericTableProps<T>) {

    // --- Renderizador de Fila Por Defecto ---
    const defaultRowRender = (item: T) => (
        <tr key={keyExtractor(item)}
            className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(item)}
        >
            {columns.map((col) => {
                const value = getValue(item, col);
                return (
                    <td key={col.key} className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}>
                        {/* ✅ 'col.render' corregido: pasa (value, item) */}
                        {col.render
                            ? col.render(value, item)
                            : (value !== null && value !== undefined ? String(value) : 'N/A')
                        }
                    </td>
                );
            })}
        </tr>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            {/* ... (Header y Thead se mantienen igual) ... */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Lista de Gastos</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            scope="col"
                            className={`py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="p-12 sm:p-16">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    No hay gastos registrados
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md">
                                    Comienza agregando tu primer gasto para llevar un mejor control de tus finanzas
                                </p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    data.map((item) => (
                        <Fragment key={keyExtractor(item)}>
                            {renderRow
                                ? renderRow(item, columns) // Usa la función personalizada
                                : defaultRowRender(item)   // Usa la función por defecto
                            }
                        </Fragment>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}