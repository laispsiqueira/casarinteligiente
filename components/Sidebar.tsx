
import React, { useState } from 'react';
import { AppMode } from '../types';
import { useWedding } from '../context/WeddingContext';
import { Users, CheckSquare, Briefcase, Settings, Heart, MessageSquareMore, Sparkles, Sun, Moon, ChevronDown, User, LogOut, CreditCard, LayoutDashboard, BarChart3, Lock } from 'lucide-react';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const { theme, setTheme, user } = useWedding();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Ordem rigorosa: estudio, consultor, meu planejamento, convidados, fornecedores, painel de noivo, painel admin
  const allNavItems = [
    { id: AppMode.IMAGES, icon: Sparkles, label: 'Estúdio de Design', color: 'text-[#ED8932]' },
    { id: AppMode.CHAT, icon: MessageSquareMore, label: 'Consultoria Vanessa', color: 'text-[#ED8932]' },
    { id: AppMode.PLANNER, icon: CheckSquare, label: 'Meu Planejamento', color: 'text-[#ED8932]' },
    { id: AppMode.GUESTS, icon: Users, label: 'Convidados & RSVP', color: 'text-[#ED8932]' },
    { id: AppMode.SUPPLIERS, icon: Briefcase, label: 'Fornecedores', color: 'text-[#ED8932]' },
    { id: AppMode.DASHBOARD, icon: BarChart3, label: 'Painel de Noivos', color: 'text-sky-400' },
    { id: AppMode.ACCOUNT, icon: LayoutDashboard, label: 'Gestão & Clientes', color: 'text-emerald-400' },
  ];

  const getVisibility = (itemId: AppMode) => {
    // Administrador vê tudo
    if (user.role === 'Administrador') return { visible: true, locked: false };

    // Regras por perfil
    switch (user.role) {
      case 'Noivo Free':
        if ([AppMode.IMAGES, AppMode.CHAT, AppMode.PLANNER].includes(itemId)) return { visible: true, locked: false };
        if ([AppMode.GUESTS, AppMode.SUPPLIERS].includes(itemId)) return { visible: true, locked: true };
        return { visible: false, locked: false };
      
      case 'Noivo+':
        if ([AppMode.IMAGES, AppMode.CHAT, AppMode.PLANNER, AppMode.GUESTS, AppMode.SUPPLIERS].includes(itemId)) return { visible: true, locked: false };
        return { visible: false, locked: false };

      case 'Assessor Free':
      case 'Assessor Plus':
      case 'Assessor Premium':
        if ([AppMode.IMAGES, AppMode.CHAT, AppMode.PLANNER, AppMode.GUESTS].includes(itemId)) return { visible: true, locked: false };
        if ([AppMode.SUPPLIERS, AppMode.DASHBOARD, AppMode.ACCOUNT].includes(itemId)) return { visible: true, locked: false }; // User said assessor free sees up to convidados, but entry allowed to others with restricted action
        return { visible: true, locked: false };

      default:
        return { visible: false, locked: false };
    }
  };

  const handleNavClick = (item: any) => {
    const status = getVisibility(item.id);
    if (status.locked) {
      onModeChange(AppMode.UPGRADE);
    } else {
      onModeChange(item.id);
    }
  };

  const handleProfileNav = (targetMode: AppMode) => {
    onModeChange(targetMode);
    setIsProfileOpen(false);
  };

  return (
    <aside className="w-20 md:w-64 flex flex-col glass border-r border-white/5 h-full p-4 shrink-0 transition-all z-20">
      <div className="relative mb-6">
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#402005] to-[#ED8932] flex items-center justify-center text-white font-bold shadow-lg shrink-0">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-xl" /> : user.name[0]}
          </div>
          <div className="hidden md:flex flex-col items-start overflow-hidden">
            <span className="text-sm font-serif font-bold text-[var(--brand-text)] truncate w-full text-left">{user.name}</span>
            <span className="text-[10px] text-[#ED8932] font-bold uppercase tracking-wider">{user.role}</span>
          </div>
          <ChevronDown className={`hidden md:block w-4 h-4 ml-auto text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {isProfileOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 p-2 glass border border-[#ED8932]/20 rounded-2xl shadow-2xl z-40 animate-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => handleProfileNav(AppMode.ACCOUNT)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs text-[var(--brand-text-muted)] hover:text-[var(--brand-text)] hover:bg-white/5 transition-all"
              >
                <User className="w-4 h-4 text-[#ED8932]" /> Meu Perfil
              </button>
              <div className="h-px bg-white/5 my-1" />
              <button className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-all">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center md:items-start gap-1 px-2 mb-8">
        <div className="hidden md:block">
          <h1 className="text-xl font-bold tracking-tight text-[var(--brand-text)] leading-tight font-serif transition-colors">Casar Inteligente</h1>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">by simplifier</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {allNavItems.map((item) => {
          const { visible, locked } = getVisibility(item.id);
          if (!visible) return null;

          const Icon = item.icon;
          const isActive = currentMode === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-[#402005] text-white shadow-lg border border-[#ED8932]/20' 
                : 'text-[var(--brand-text-muted)] hover:bg-white/5 hover:text-[var(--brand-text)]'
              } ${locked ? 'opacity-50' : ''}`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110 ' + item.color : 'group-hover:scale-110'}`} />
              <span className="font-medium text-sm hidden md:block">{item.label}</span>
              {locked && <Lock className="w-3 h-3 ml-auto text-amber-500 hidden md:block" />}
              {isActive && (
                <div className="absolute left-[-16px] w-1.5 h-6 bg-[#ED8932] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 bg-[#ED8932]/5 rounded-2xl border border-[#ED8932]/10 mb-4 hidden md:block">
        <p className="text-[10px] font-bold text-[#ED8932] uppercase mb-1">Decisão Consciente</p>
        <p className="text-[11px] text-[var(--brand-text-muted)] leading-relaxed">Proteção contra arrependimento.</p>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-center md:justify-start px-1">
           <div className="flex bg-black/10 dark:bg-white/5 p-1 rounded-full border border-white/5 w-full md:w-auto overflow-hidden">
              <button onClick={() => setTheme('light')} className={`flex-1 md:flex-none p-2 rounded-full transition-all ${theme === 'light' ? 'bg-[#ED8932] text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`} title="Modo Claro"><Sun className="w-4 h-4" /></button>
              <button onClick={() => setTheme('dark')} className={`flex-1 md:flex-none p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-[#ED8932] text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`} title="Modo Escuro"><Moon className="w-4 h-4" /></button>
           </div>
        </div>
        <button className="flex items-center gap-4 p-3.5 rounded-xl w-full text-[var(--brand-text-muted)] hover:bg-white/5 hover:text-[var(--brand-text)] transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span className="font-medium text-sm hidden md:block">Configurações</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
