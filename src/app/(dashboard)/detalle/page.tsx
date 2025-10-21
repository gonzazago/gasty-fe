import { Sidebar, Header, DetalleClient } from '@/components';
import { getExpenseDetailsByMonth } from '@/actions/expenses';

export default async function DetallePage() {
  // Obtener datos usando Server Actions
  const expensesData = await getExpenseDetailsByMonth();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <DetalleClient initialData={expensesData} />
        </main>
      </div>
    </div>
  );
}
