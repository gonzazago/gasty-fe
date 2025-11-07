// src/app/(dashboard)/detalle/page.tsx (Corregido)

// 1. Importa la acción que faltaba
import { getAllCards } from '@/actions/banksAndCards';
import { getExpenseDetailsByMonth } from '@/actions/expenses';
import { DetalleClient } from '@/components'; // 'Sidebar' y 'Header' no son necesarios aquí

export default async function DetallePage() {

    // 2. Obtén AMBOS datos en paralelo (SSR)
    const [expensesData, cardsData] = await Promise.all([
        getExpenseDetailsByMonth(),
        getAllCards()
    ]);

    return (
        // El layout (layout.tsx) ya envuelve esto con el NavigationWrapper
        // Así que aquí solo renderizamos el contenido de la página
        <DetalleClient
            initialData={expensesData}
            initialCards={cardsData} // 3. Pasa los cards al cliente
        />
    );
}