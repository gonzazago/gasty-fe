// src/components/cells/FixedCell.tsx
'use client';

interface FixedCellProps {
    fixed: boolean;
}

export default function FixedCell({fixed}: FixedCellProps) {
    const text = fixed ? 'Fijo' : 'Variable';
    const className = fixed
        ? 'bg-blue-100 text-blue-800'
        : 'bg-orange-100 text-orange-800';

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {text}
    </span>
    );
}