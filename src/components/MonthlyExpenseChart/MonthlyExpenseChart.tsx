'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyData {
  month: string;
  expense: number;
  budget: number;
}

interface MonthlyExpenseChartProps {
  data: MonthlyData[];
}

export default function MonthlyExpenseChart({ data }: MonthlyExpenseChartProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Comparación Presupuesto vs Gastos</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Análisis mensual</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full shadow-sm"></div>
            <span className="text-xs sm:text-sm text-gray-600">Gastos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Presupuesto</span>
          </div>
          <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
            <option>Este año</option>
          </select>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
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
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, '']}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="expense" 
              fill="#8B5CF6" 
              name="Gastos"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="budget" 
              fill="#C084FC" 
              name="Presupuesto"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
