
import React, { useState, useCallback } from 'react';
import { AppMode, Message, Task } from './types';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';
import PlannerSection from './components/PlannerSection';
import SupplierSection from './components/SupplierSection';
import GuestSection from './components/GuestSection';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
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
      </main>
    </div>
  );
};

export default App;
