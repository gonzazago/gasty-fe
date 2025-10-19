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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Comparación de presupuesto y gastos</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Gastos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
            <span className="text-sm text-gray-600">Presupuesto</span>
          </div>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option>Este año</option>
          </select>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="expense" 
              fill="#9333ea" 
              name="Gastos"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="budget" 
              fill="#c084fc" 
              name="Presupuesto"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
