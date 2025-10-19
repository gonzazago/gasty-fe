interface MetricCardProps {
  title: string;
  value: string;
  currency: string;
  change: {
    percentage: string;
    isPositive: boolean;
    description: string;
  };
  details: {
    transactions: number;
    categories: number;
  };
}

export default function MetricCard({ 
  title, 
  value, 
  currency, 
  change, 
  details 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <select className="text-sm text-gray-600 border-none bg-transparent focus:outline-none">
          <option>{currency}</option>
        </select>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-sm">
              {change.isPositive ? '↗' : '↗'}
            </span>
            <span className="text-sm font-medium">{change.percentage}</span>
          </div>
          <span className="text-sm text-gray-600">{change.description}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span>{details.transactions} transacciones</span>
        <span>{details.categories} categorías</span>
      </div>
    </div>
  );
}
