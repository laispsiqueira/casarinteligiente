
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
  originalAdmin: UserProfile | null;
  setOriginalAdmin: (user: UserProfile | null) => void;
  invoices: Invoice[];
  clients: ClientData[];
  availableUsers: UserProfile[];
  setAvailableUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const INITIAL_MOCK_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    name: 'Lais Siqueira',
    email: 'adm@exemplo.com',
    role: 'Administrador',
    plan: 'Enterprise',
    createdAt: Date.now() - 10000000000,
  },
  {
    id: 'user_assessor_01',
    name: 'Carlos Eduardo',
    email: 'assesor@exemplo.com',
    role: 'Assessor Free',
    plan: 'Free',
    createdAt: Date.now() - 5000000000,
  },
  {
    id: 'user_plus_01',
    name: 'Roberto & Julia',
    email: 'roberto.julia@exemplo.com',
    role: 'Noivo+',
    plan: 'Simplifier',
    createdAt: Date.now() - 3000000000,
    weddingDate: '2025-10-15',
    assessorId: 'user_assessor_01'
  },
  {
    id: 'user_free_01',
    name: 'Maria Clara',
    email: 'noivofree@exemplo.com',
    role: 'Noivo Free',
    plan: 'Free',
    createdAt: Date.now() - 1000000000,
    weddingDate: '2026-05-20',
  }
];

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.IMAGES);
  const [pendingInspiration, setPendingInspiration] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ci_theme');
      return (saved as 'dark' | 'light') || 'dark';
    } catch { return 'dark'; }
  });

  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('ci_available_users');
      return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS;
    } catch { return INITIAL_MOCK_USERS; }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ci_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = availableUsers.find(u => u.id === parsed.id);
        return updated || parsed;
      }
    } catch (e) { console.error("Error loading current user", e); }
    return availableUsers[0];
  });

  const [originalAdmin, setOriginalAdmin] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ci_original_admin');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  useEffect(() => {
    localStorage.setItem('ci_current_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ci_available_users', JSON.stringify(availableUsers));
  }, [availableUsers]);

  useEffect(() => {
    if (originalAdmin) {
      localStorage.setItem('ci_original_admin', JSON.stringify(originalAdmin));
    } else {
      localStorage.removeItem('ci_original_admin');
    }
  }, [originalAdmin]);

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
      try {
        const savedTasks = localStorage.getItem('ci_tasks');
        const savedGuests = localStorage.getItem('ci_guests');
        
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedGuests) setGuests(JSON.parse(savedGuests));

        const savedMessages = await db.load<Message[]>('ci_messages');
        const savedAssets = await db.load<GeneratedAsset[]>('ci_assets');
        const savedInvoices = await db.load<Invoice[]>('ci_invoices');
        const savedClients = await db.load<ClientData[]>('ci_clients');

        if (savedMessages) setMessages(savedMessages);
        if (savedAssets) setAssets(savedAssets);
        if (savedInvoices) setInvoices(savedInvoices);
        if (savedClients) setClients(savedClients);
      } catch (err) {
        console.error("Falha ao carregar dados salvos:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => { if (!isLoaded) return; localStorage.setItem('ci_tasks', JSON.stringify(tasks)); }, [tasks, isLoaded]);
  useEffect(() => { if (!isLoaded) return; localStorage.setItem('ci_guests', JSON.stringify(guests)); }, [guests, isLoaded]);
  useEffect(() => { if (!isLoaded) return; db.save('ci_messages', messages); }, [messages, isLoaded]);
  useEffect(() => { if (!isLoaded) return; db.save('ci_assets', assets); }, [assets, isLoaded]);
  useEffect(() => { if (!isLoaded) return; db.save('ci_invoices', invoices); }, [invoices, isLoaded]);
  useEffect(() => { if (!isLoaded) return; db.save('ci_clients', clients); }, [clients, isLoaded]);

  const addMessage = useCallback((msg: Message) => { setMessages(prev => [...prev, msg]); }, []);
  const addAsset = useCallback((asset: GeneratedAsset) => { setAssets(prev => [asset, ...prev]); }, []);

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
      tasks, setTasks, guests, setGuests, messages, addMessage, assets, addAsset,
      mode, setMode, pendingInspiration, setPendingInspiration, theme, setTheme,
      user, setUser, originalAdmin, setOriginalAdmin, invoices, clients, 
      availableUsers, setAvailableUsers
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
