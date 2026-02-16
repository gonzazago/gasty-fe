// src/components/ExpenseFilterSort/ExpenseFilterSort.tsx
import React from 'react';

interface ExpenseFilterSortProps {
    categories: string[];
    onFilterChange: (filters: { category: string }) => void;
    onSortChange: (sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void;
}

export default function ExpenseFilterSort({ categories, onFilterChange, onSortChange }: ExpenseFilterSortProps) {
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ category: e.target.value });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortBy, sortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
        onSortChange({ sortBy, sortOrder });
    };

    return (
        <div className="flex space-x-4 my-4">
            <div>
                <label htmlFor="category-filter" className="mr-2">Filtrar por categoría:</label>
                <select id="category-filter" onChange={handleCategoryChange} className="border rounded p-1">
                    <option value="">Todas</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sort-by" className="mr-2">Ordenar por:</label>
                <select id="sort-by" onChange={handleSortChange} className="border rounded p-1">
                    <option value="date-desc">Fecha (más reciente)</option>
                    <option value="date-asc">Fecha (más antiguo)</option>
                    <option value="amount-desc">Monto (mayor a menor)</option>
                    <option value="amount-asc">Monto (menor a mayor)</option>
                    <option value="category-asc">Categoría (A-Z)</option>
                    <option value="category-desc">Categoría (Z-A)</option>
                </select>
            </div>
        </div>
    );
}
