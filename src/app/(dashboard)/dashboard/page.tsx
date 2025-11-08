// src/app/(dashboard)/dashboard/page.tsx
import {
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
    // 1. Obtener datos (ahora son dinámicos)
    const [metricsData, balanceData, expenseData, monthlyData] = await Promise.all([
        getMetricsData(),
        getBalanceData(),
        getExpenseData(),
        getMonthlyData()
    ]);

    const totalExpenseString = metricsData.find(m => m.title === 'Total Gastos')?.value || '$0.00';

    return (
        <div className="flex flex-col min-w-0 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {metricsData.map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <BalanceChart data={balanceData} />
                <ExpenseChart data={expenseData} totalExpense={totalExpenseString} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <MonthlyExpenseChart data={monthlyData} />
            </div>
        </div>
    );
}