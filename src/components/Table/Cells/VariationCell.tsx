// src/components/cells/VariationCell.tsx
'use client';

import {ArrowDown, ArrowUp} from 'lucide-react';

interface VariationCellProps {
    value: number | undefined | null;
}

export default function VariationCell({value}: VariationCellProps) {
    if (value === null || value === undefined || value === 0) {
        return <span className="text-gray-400">-</span>;
    }

    // En gastos, un valor positivo (más gasto) es negativo (rojo)
    const isPositive = value > 0;
    const colorClass = isPositive ? 'text-red-600' : 'text-green-600';
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
        <span className={`flex items-center text-sm font-medium ${colorClass}`}>
    <Icon className="w-4 h-4 mr-1"/>
            {Math.abs(value).toFixed(1)}%
        </span>
    );
}