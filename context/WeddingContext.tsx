import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Guest, Message, GeneratedAsset, AppMode, UserProfile, Invoice, ClientData, UserRole } from '../types';
import { db } from '../services/db';

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
  pendingInspiration: string | null;
  setPendingInspiration: (url: string | null) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  invoices: Invoice[];
  clients: ClientData[];
  availableUsers: UserProfile[];
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    name: 'Ana Beatriz',
    email: 'ana.beatriz@exemplo.com',
    role: 'Administrador',
    plan: 'Enterprise',
    createdAt: Date.now() - 5000000000,
    weddingDate: '2025-12-20'
  },
  {
    id: 'user_assessor',
    name: 'Carlos Eduardo',
    email: 'carlos.assessor@exemplo.com',
    role: 'Assessor',
    plan: 'Enterprise',
    createdAt: Date.now() - 4000000000,
  },
  {
    id: 'user_plus',
    name: 'Roberto & Julia',
    email: 'roberto.julia@plus.com',
    role: 'Noivo+',
    plan: 'Simplifier',
    createdAt: Date.now() - 3000000000,
    weddingDate: '2025-10-15'
  },
  {
    id: 'user_free',
    name: 'Maria Clara',
    email: 'maria.clara@free.com',
    role: 'Noivo Free',
    plan: 'Free',
    createdAt: Date.now() - 1000000000,
    weddingDate: '2026-05-20'
  }
];

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [pendingInspiration, setPendingInspiration] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ci_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ci_current_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  useEffect(() => {
    localStorage.setItem('ci_current_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('ci_theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      const savedTasks = localStorage.getItem('ci_tasks');
      const savedGuests = localStorage.getItem('ci_guests');
      
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedGuests) setGuests(JSON.parse(savedGuests));
      else setGuests([
        { id: '1', name: 'Maria Silva', status: 'Confirmado', notified: true },
        { id: '2', name: 'João Souza', status: 'Pendente', notified: false },
      ]);

      const savedMessages = await db.load<Message[]>('ci_messages');
      const savedAssets = await db.load<GeneratedAsset[]>('ci_assets');
      const savedInvoices = await db.load<Invoice[]>('ci_invoices');
      const savedClients = await db.load<ClientData[]>('ci_clients');

      if (savedMessages) setMessages(savedMessages);
      if (savedAssets) setAssets(savedAssets);
      
      if (savedInvoices) {
        setInvoices(savedInvoices);
      } else {
        const initialInvoices: Invoice[] = [
          { id: 'INV-001', date: Date.now() - 2592000000, amount: 500, status: 'Pago', planName: 'Simplifier', method: 'PIX' },
          { id: 'INV-002', date: Date.now() - 86400000, amount: 700, status: 'Pendente', planName: 'Mentoria Extra', method: 'Cartão de Crédito' }
        ];
        setInvoices(initialInvoices);
        db.save('ci_invoices', initialInvoices);
      }

      if (savedClients) {
        setClients(savedClients);
      } else {
        const initialClients: ClientData[] = [
          { id: 'C-01', coupleNames: 'Carla & Marcos', status: 'Ativo', contractValue: 2500, nextPayment: Date.now() + 604800000 },
          { id: 'C-02', coupleNames: 'Juliana & Felipe', status: 'Finalizado', contractValue: 1800 }
        ];
        setClients(initialClients);
        db.save('ci_clients', initialClients);
      }

      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ci_tasks', JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ci_guests', JSON.stringify(guests));
  }, [guests, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    db.save('ci_messages', messages);
  }, [messages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    db.save('ci_assets', assets);
  }, [assets, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    db.save('ci_invoices', invoices);
  }, [invoices, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    db.save('ci_clients', clients);
  }, [clients, isLoaded]);

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const addAsset = useCallback((asset: GeneratedAsset) => {
    setAssets(prev => [asset, ...prev]);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a0d02] text-[#ED8932]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ED8932] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif italic">Preparando seu casamento inteligente...</p>
        </div>
      </div>
    );
  }

  return (
    <WeddingContext.Provider value={{ 
      tasks, setTasks, 
      guests, setGuests, 
      messages, addMessage, 
      assets, addAsset,
      mode, setMode,
      pendingInspiration,
      setPendingInspiration,
      theme,
      setTheme,
      user,
      setUser,
      invoices,
      clients,
      availableUsers: MOCK_USERS
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