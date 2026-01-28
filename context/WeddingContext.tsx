
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Guest, Message, GeneratedAsset, AppMode } from '../types';

interface WeddingContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  messages: Message[];
  addMessage: (msg: Message) => void;
  assets: GeneratedAsset[];
  addAsset: (asset: GeneratedAsset) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ci_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('ci_guests');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Maria Silva', status: 'Confirmado', notified: true },
      { id: '2', name: 'João Souza', status: 'Pendente', notified: false },
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ci_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [assets, setAssets] = useState<GeneratedAsset[]>(() => {
    const saved = localStorage.getItem('ci_assets');
    return saved ? JSON.parse(saved) : [];
  });

  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);

  // Persistence Effects
  useEffect(() => localStorage.setItem('ci_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('ci_guests', JSON.stringify(guests)), [guests]);
  useEffect(() => localStorage.setItem('ci_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('ci_assets', JSON.stringify(assets)), [assets]);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const addAsset = useCallback((asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  }, []);

  return (
    <WeddingContext.Provider value={{ 
      tasks, setTasks, 
      guests, setGuests, 
      messages, addMessage, 
      assets, addAsset,
      mode, setMode 
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) throw new Error('useWedding must be used within a WeddingProvider');
  return context;
};
