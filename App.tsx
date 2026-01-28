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

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-20 text-center"><h1>Algo deu errado. Reiniciando...</h1><button onClick={() => window.location.reload()} className="mt-4 p-2 bg-orange-500 rounded">Recarregar</button></div>;
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { mode, setMode } = useWedding();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--app-bg)] text-[var(--brand-text)] transition-colors duration-300">
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