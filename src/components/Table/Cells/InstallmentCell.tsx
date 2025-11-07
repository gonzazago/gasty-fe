// src/components/cells/InstallmentsCell.tsx
'use client';

interface InstallmentsCellProps {
    split: { current: number; total: number } | null | undefined;
}

export default function InstallmentsCell({ split }: InstallmentsCellProps) {
    if (!split) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <span className="text-gray-700">
      {split.current} / {split.total}
    </span>
    );
}