import React, { useState, useCallback } from 'react';
import { AppMode, Message, GeneratedAsset } from './types';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';
import PlannerSection from './components/PlannerSection';
import SupplierSection from './components/SupplierSection';
import GuestSection from './components/GuestSection';
import ImageSection from './components/ImageSection';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  const handleSendMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const handleAssetGenerated = useCallback((asset: GeneratedAsset) => {
    setGeneratedAssets(prev => [asset, ...prev]);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#030712] text-gray-100">
      <Sidebar currentMode={mode} onModeChange={setMode} />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {mode === AppMode.CHAT && (
          <ChatSection 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        )}
        {mode === AppMode.PLANNER && (
          <PlannerSection />
        )}
        {mode === AppMode.SUPPLIERS && (
          <SupplierSection />
        )}
        {mode === AppMode.GUESTS && (
          <GuestSection />
        )}
        {mode === AppMode.IMAGES && (
          <ImageSection 
            assets={generatedAssets} 
            onAssetGenerated={handleAssetGenerated} 
          />
        )}
      </main>
    </div>
  );
};

export default App;