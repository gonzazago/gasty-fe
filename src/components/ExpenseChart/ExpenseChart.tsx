'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {ExpenseData} from "@/types/dashboard";
import { useState } from 'react';

// Paleta de colores moderna y distintiva
const COLOR_PALETTE = [
  '#8B5CF6', // Purple (principal)
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
  '#A855F7', // Violet
];

interface ExpenseChartProps {
  data: ExpenseData[];
  totalExpense: string;
}

export default function ExpenseChart({ data, totalExpense }: ExpenseChartProps) {
  // Asignar colores de la paleta si no vienen en los datos
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
  }));

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calcular el total para porcentajes
  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-purple-600 font-medium">
            ${data.value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Estadísticas de Gastos</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Distribución por categorías
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
            <option>Gastos</option>
          </select>
          <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
            <option>Detalles</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={hoveredIndex === index ? '#fff' : entry.color}
                      strokeWidth={hoveredIndex === index ? 3 : 1}
                      style={{
                        filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Gastos</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalExpense}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend mejorada */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dataWithColors.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              const isHovered = hoveredIndex === index;
              
              return (
                <div 
                  key={index} 
                  className={`
                    flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                    ${isHovered 
                      ? 'bg-purple-50 border-purple-200 shadow-sm scale-105' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isHovered ? 'text-purple-900' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className={`text-sm font-semibold ${isHovered ? 'text-purple-600' : 'text-gray-700'}`}>
                      ${item.value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
