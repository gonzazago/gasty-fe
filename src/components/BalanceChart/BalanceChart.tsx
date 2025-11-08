'use client';

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface BalanceData {
  date: string;
  currentMonth: number;
  lastMonth: number;
}

interface BalanceChartProps {
  data: BalanceData[];
}

export default function BalanceChart({ data }: BalanceChartProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Resumen del Balance Total</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Evolución mensual</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full shadow-sm"></div>
            <span className="text-xs sm:text-sm text-gray-600">Este mes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-xs sm:text-sm text-gray-600">Mes anterior</span>
          </div>
          <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
            <option>Balance total</option>
          </select>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
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
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="currentMonth"
              stroke="#8B5CF6"
              fill="url(#colorCurrent)"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="lastMonth"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
