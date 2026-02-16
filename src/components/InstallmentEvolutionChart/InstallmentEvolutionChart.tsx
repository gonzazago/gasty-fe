'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/types/dashboard';

interface InstallmentEvolutionData {
  month: string;
  [cardName: string]: string | number; // Permite propiedades dinámicas para cada tarjeta
}

interface InstallmentEvolutionChartProps {
  data: InstallmentEvolutionData[];
  cards: Card[];
}

// Paleta de colores para las líneas
const COLOR_PALETTE = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

export default function InstallmentEvolutionChart({ data, cards }: InstallmentEvolutionChartProps) {
  // Obtener nombres de tarjetas que tienen datos
  const cardNames = cards.map(card => card.name);
  
  // Filtrar solo las tarjetas que tienen datos en el gráfico
  const activeCards = cardNames.filter(cardName => 
    data.some(item => item[cardName] !== undefined && (item[cardName] as number) > 0)
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${(entry.value as number).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Evolución de Gastos en Cuotas</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Por tarjeta a lo largo del tiempo</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {activeCards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeCards.map((cardName, index) => {
                const card = cards.find(c => c.name === cardName);
                const color = card?.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
                return (
                  <div key={cardName} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-600">{cardName}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        {activeCards.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {activeCards.map((cardName, index) => {
                const card = cards.find(c => c.name === cardName);
                const color = card?.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
                return (
                  <Line
                    key={cardName}
                    type="monotone"
                    dataKey={cardName}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: color }}
                    activeDot={{ r: 6 }}
                    name={cardName}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-sm">No hay gastos en cuotas registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}

