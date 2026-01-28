
import React from 'react';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { AppMode } from './types';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';
import PlannerSection from './components/PlannerSection';
import SupplierSection from './components/SupplierSection';
import GuestSection from './components/GuestSection';
import ImageSection from './components/ImageSection';
import AccountSection from './components/AccountSection';
import DashboardSection from './components/DashboardSection';
import UpgradeSection from './components/UpgradeSection';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Layout } from './shared/components/Layout';
import { LogOut, Eye } from 'lucide-react';

const ImpersonationBanner: React.FC = () => {
  const { originalAdmin, setOriginalAdmin, setUser, user } = useWedding();
  if (!originalAdmin) return null;

  return (
    <div className="bg-[#ED8932] text-white px-4 py-2 flex items-center justify-between shadow-2xl z-50">
      <div className="flex items-center gap-2 text-xs font-bold">
        <Eye className="w-4 h-4" /> VISUALIZANDO COMO: <span className="underline">{user.name}</span>
      </div>
      <button 
        onClick={() => { setUser(originalAdmin); setOriginalAdmin(null); }}
        className="bg-black/20 hover:bg-black/40 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
      >
        <LogOut className="w-3 h-3" /> VOLTAR
      </button>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { mode, setMode } = useWedding();
  
  const sections: Record<AppMode, React.ReactNode> = {
    [AppMode.IMAGES]: <ImageSection />,
    [AppMode.CHAT]: <ChatSection />,
    [AppMode.PLANNER]: <PlannerSection />,
    [AppMode.GUESTS]: <GuestSection />,
    [AppMode.SUPPLIERS]: <SupplierSection />,
    [AppMode.DASHBOARD]: <DashboardSection />,
    [AppMode.ACCOUNT]: <AccountSection />,
    [AppMode.UPGRADE]: <UpgradeSection />,
  };

  return (
    <Layout>
      <Sidebar currentMode={mode} onModeChange={setMode} />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden" id="main-content">
        <ErrorBoundary>
          {sections[mode]}
        </ErrorBoundary>
      </main>
    </Layout>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <WeddingProvider>
      <ImpersonationBanner />
      <MainContent />
    </WeddingProvider>
  </ErrorBoundary>
);

export default App;
