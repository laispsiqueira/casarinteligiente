
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Guest, Message, GeneratedAsset, AppMode, UserProfile, Invoice, ClientData } from '../types';
import { persistence } from '../services/persistence';

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

// Definição dos perfis de teste consistentes solicitados pelo usuário
const INITIAL_USERS: UserProfile[] = [
  { 
    id: 'user_lais', 
    name: 'Lais Siqueira', 
    email: 'adm@exemplo.com', 
    role: 'Administrador', 
    plan: 'Enterprise', 
    createdAt: Date.now() 
  },
  { 
    id: 'user_roberto', 
    name: 'Roberto', 
    email: 'assessor+@exemplo.com', 
    role: 'Assessor Plus', 
    plan: 'Plus', 
    createdAt: Date.now() 
  },
  { 
    id: 'user_helena', 
    name: 'Helena', 
    email: 'assessorf@exemplo.com', 
    role: 'Assessor Free', 
    plan: 'Free', 
    createdAt: Date.now() 
  },
  { 
    id: 'user_tomas', 
    name: 'Tomas', 
    email: 'noivof@exemplo.com', 
    role: 'Noivo Free', 
    plan: 'Free', 
    createdAt: Date.now() 
  },
  { 
    id: 'user_luisa', 
    name: 'Luisa', 
    email: 'noivo+@exemplo.com', 
    role: 'Noivo+', 
    plan: 'Plus', 
    createdAt: Date.now(), 
    assessorId: 'user_roberto' 
  },
  { 
    id: 'user_lucas', 
    name: 'Lucas', 
    email: 'noivof_lucas@exemplo.com', 
    role: 'Noivo Free', 
    plan: 'Free', 
    createdAt: Date.now(), 
    assessorId: 'user_helena' 
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
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => persistence.loadFromStorage('ci_theme', 'dark'));
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(() => persistence.loadFromStorage('ci_available_users', INITIAL_USERS));
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = persistence.loadFromStorage<UserProfile | null>('ci_current_user', null);
    if (saved) return saved;
    // Tenta pegar a Lais Siqueira (Admin) como primeiro usuário
    return availableUsers.find(u => u.name === 'Lais Siqueira') || availableUsers[0];
  });
  const [originalAdmin, setOriginalAdmin] = useState<UserProfile | null>(() => persistence.loadFromStorage('ci_original_admin', null));

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  // Sync state to storage/db
  useEffect(() => {
    if (!isLoaded) return;
    persistence.saveToStorage('ci_current_user', user);
    persistence.saveToStorage('ci_available_users', availableUsers);
    persistence.saveToStorage('ci_original_admin', originalAdmin);
    persistence.saveToStorage('ci_theme', theme);
    persistence.saveToStorage('ci_tasks', tasks);
    persistence.saveToStorage('ci_guests', guests);
    
    persistence.saveToDB('ci_messages', messages);
    persistence.saveToDB('ci_assets', assets);
    persistence.saveToDB('ci_invoices', invoices);
    persistence.saveToDB('ci_clients', clients);
  }, [user, availableUsers, originalAdmin, theme, tasks, guests, messages, assets, invoices, clients, isLoaded]);

  useEffect(() => {
    const init = async () => {
      const savedTasks = persistence.loadFromStorage<Task[]>('ci_tasks', []);
      const savedGuests = persistence.loadFromStorage<Guest[]>('ci_guests', []);
      const dbMsgs = await persistence.loadFromDB<Message[]>('ci_messages');
      const dbAssets = await persistence.loadFromDB<GeneratedAsset[]>('ci_assets');
      
      if (savedTasks.length) setTasks(savedTasks);
      if (savedGuests.length) setGuests(savedGuests);
      if (dbMsgs) setMessages(dbMsgs);
      if (dbAssets) setAssets(dbAssets);
      setIsLoaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'light') {
      el.classList.add('light-mode');
    } else {
      el.classList.remove('light-mode');
    }
  }, [theme]);

  const addMessage = useCallback((msg: Message) => setMessages(p => [...p, msg]), []);
  const addAsset = useCallback((asset: GeneratedAsset) => setAssets(p => [asset, ...p]), []);

  if (!isLoaded) return (
    <div className="flex flex-col h-screen items-center justify-center bg-[var(--brand-bg)] text-[#ED8932] gap-4">
      <div className="w-12 h-12 border-4 border-[#ED8932] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-serif text-lg">Iniciando Inteligência...</p>
    </div>
  );

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
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider');
  return ctx;
};
