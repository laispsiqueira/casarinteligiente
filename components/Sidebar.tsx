import React from 'react';
import { AppMode } from '../types';
import { Users, CheckSquare, Briefcase, Settings, Heart, MessageSquareMore } from 'lucide-react';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const navItems = [
    { id: AppMode.CHAT, icon: MessageSquareMore, label: 'Consultoria Vanessa', color: 'text-[#ED8932]' },
    { id: AppMode.PLANNER, icon: CheckSquare, label: 'Meu Planejamento', color: 'text-[#ED8932]' },
    { id: AppMode.GUESTS, icon: Users, label: 'Convidados & RSVP', color: 'text-[#ED8932]' },
    { id: AppMode.SUPPLIERS, icon: Briefcase, label: 'Fornecedores', color: 'text-[#ED8932]' },
  ];

  return (
    <aside className="w-20 md:w-64 flex flex-col glass border-r border-white/5 h-full p-4 shrink-0 transition-all z-20">
      <div className="flex flex-col items-center md:items-start gap-1 px-2 mb-10 mt-4">
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight font-serif">Casar</h1>
          <h1 className="text-2xl font-bold tracking-tight text-[#ED8932] leading-tight font-serif mt-[-8px]">Inteligente</h1>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">by simplifier</p>
        </div>
        <div className="md:hidden w-10 h-10 bg-[#402005] rounded-lg flex items-center justify-center border border-[#ED8932]/30">
          <Heart className="w-5 h-5 text-[#ED8932]" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id)}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-[#402005] text-white shadow-lg border border-[#ED8932]/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110 ' + item.color : 'group-hover:scale-110'}`} />
              <span className="font-medium text-sm hidden md:block">{item.label}</span>
              {isActive && (
                <div className="absolute left-[-16px] w-1.5 h-6 bg-[#ED8932] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 bg-[#ED8932]/5 rounded-2xl border border-[#ED8932]/10 mb-4 hidden md:block">
        <p className="text-[10px] font-bold text-[#ED8932] uppercase mb-1">Decisão Consciente</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">Proteção contra arrependimento e clareza antes de gastar.</p>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button className="flex items-center gap-4 p-3.5 rounded-xl w-full text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span className="font-medium text-sm hidden md:block">Configurações</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;