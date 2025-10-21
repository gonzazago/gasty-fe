import { 
  Sidebar, 
  Header, 
  MetricCard, 
  BalanceChart, 
  ExpenseChart, 
  MonthlyExpenseChart 
} from '@/components';
import { 
  getMetricsData, 
  getBalanceData, 
  getExpenseData, 
  getMonthlyData 
} from '@/actions/expenses';

export default async function Dashboard() {
  // Obtener datos usando Server Actions
  const [metricsData, balanceData, expenseData, monthlyData] = await Promise.all([
    getMetricsData(),
    getBalanceData(),
    getExpenseData(),
    getMonthlyData()
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BalanceChart data={balanceData} />
            <ExpenseChart data={expenseData} totalExpense="$6,222.00" />
          </div>

          {/* Gráfico de gastos mensuales */}
          <div className="grid grid-cols-1 gap-6">
            <MonthlyExpenseChart data={monthlyData} />
          </div>
        </main>
      </div>
    </div>
  );
}
