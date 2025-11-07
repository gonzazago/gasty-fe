'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {ExpenseData} from "@/types/dashboard";


interface ExpenseChartProps {
  data: ExpenseData[];
  totalExpense: string;
}

export default function ExpenseChart({ data, totalExpense }: ExpenseChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
        <div className="flex space-x-2">
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option>Gastos</option>
          </select>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option>Detalles</option>
          </select>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Tienes un aumento de gastos en varias categorías este mes
      </p>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500">Gastos de este mes</div>
              <div className="text-lg font-bold text-gray-900">{totalExpense}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
