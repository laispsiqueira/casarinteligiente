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
import { LogOut, Eye } from 'lucide-react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-20 text-center"><h1>Algo deu errado. Reiniciando...</h1><button onClick={() => window.location.reload()} className="mt-4 p-2 bg-orange-500 rounded">Recarregar</button></div>;
    return this.props.children;
  }
}

const ImpersonationBanner: React.FC = () => {
  const { originalAdmin, setOriginalAdmin, setUser, user } = useWedding();
  
  if (!originalAdmin) return null;

  const handleReturn = () => {
    setUser(originalAdmin);
    setOriginalAdmin(null);
  };

  return (
    <div className="bg-[#ED8932] text-white px-4 py-2 flex items-center justify-between shadow-2xl z-50 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 text-xs font-bold">
        <Eye className="w-4 h-4" />
        VISUALIZANDO COMO: <span className="underline">{user.name}</span> ({user.role})
      </div>
      <button 
        onClick={handleReturn}
        className="bg-black/20 hover:bg-black/40 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
      >
        <LogOut className="w-3 h-3" /> VOLTAR PARA ADMIN
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { mode, setMode } = useWedding();

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--app-bg)] text-[var(--brand-text)] transition-colors duration-300">
      <ImpersonationBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentMode={mode} onModeChange={setMode} />
        <main className="flex-1 relative flex flex-col h-full overflow-hidden">
          {mode === AppMode.CHAT && <ChatSection />}
          {mode === AppMode.DASHBOARD && <DashboardSection />}
          {mode === AppMode.PLANNER && <PlannerSection />}
          {mode === AppMode.SUPPLIERS && <SupplierSection />}
          {mode === AppMode.GUESTS && <GuestSection />}
          {mode === AppMode.IMAGES && <ImageSection />}
          {mode === AppMode.ACCOUNT && <AccountSection />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  </ErrorBoundary>
);

export default App;