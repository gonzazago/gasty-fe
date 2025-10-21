import { Sidebar, Header, BanksAndCardsManager } from '@/components';
import { getAllBanks, getAllCards } from '@/actions/banksAndCards';

export default async function BancosPage() {
  // Obtener datos usando Server Actions
  const [banks, cards] = await Promise.all([
    getAllBanks(),
    getAllCards()
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <BanksAndCardsManager 
            initialBanks={banks}
            initialCards={cards}
          />
        </main>
      </div>
    </div>
  );
}
