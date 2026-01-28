import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { User, CreditCard, Users, ShieldCheck, Mail, Calendar, Package, Receipt, TrendingUp, CheckCircle2, Clock, Lock, ArrowLeftRight } from 'lucide-react';
import { AppMode } from '../types';

const AccountSection: React.FC = () => {
  const { user, setUser, invoices, clients, availableUsers, setMode } = useWedding();
  const isAdmin = user.role === 'Administrador';
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'management'>('profile');

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User, hidden: false },
    { id: 'billing', label: 'Faturamento', icon: CreditCard, hidden: !isAdmin },
    { id: 'management', label: 'Gestão de Clientes', icon: Users, hidden: !isAdmin },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const handleSwitchUser = (targetUser: any) => {
    setUser(targetUser);
    setMode(AppMode.CHAT); // Volta para o chat ao trocar para evitar erros de permissão na tela atual
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif">Minha Conta</h1>
          <p className="text-[var(--brand-text-muted)] text-sm">Controle de acesso e informações pessoais.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 h-fit">
          {tabs.filter(t => !t.hidden).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#ED8932] text-white shadow-lg' 
                  : 'text-[var(--brand-text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Simulador de Troca de Usuário */}
        <div className="glass p-4 rounded-2xl border-[#ED8932]/20 flex-1">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-[#ED8932] uppercase tracking-widest">
            <ArrowLeftRight className="w-3 h-3" /> Simulador de Acesso
          </div>
          <div className="flex flex-wrap gap-2">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSwitchUser(u)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  user.id === u.id 
                  ? 'bg-[#ED8932]/20 border-[#ED8932] text-[#ED8932]' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                }`}
              >
                {u.role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass p-8 rounded-3xl border-white/5 flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#402005] to-[#ED8932] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-2xl">
                {user.name[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-serif">{user.name}</h2>
                <div className="flex items-center gap-3 text-sm text-[var(--brand-text-muted)]">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#ED8932]" /> {user.email}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#ED8932]" /> {user.role}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#ED8932]">Informações de Acesso</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-[var(--brand-text-muted)]">ID do Usuário</span>
                    <span className="text-sm font-mono text-white/60">{user.id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-[var(--brand-text-muted)]">Status</span>
                    <span className="text-sm text-emerald-400 font-bold">Ativo</span>
                  </div>
                  <button className="text-[10px] font-bold text-[#ED8932] uppercase hover:underline">Alterar Dados</button>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#ED8932]">Dados do Contrato</h3>
                <div className="space-y-4">
                  {user.weddingDate && (
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-sm text-[var(--brand-text-muted)]">Data do Casamento</span>
                      <span className="text-sm text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-[#ED8932]" /> {user.weddingDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-[var(--brand-text-muted)]">Plano Ativo</span>
                    <span className="text-sm text-white flex items-center gap-2"><Package className="w-4 h-4 text-[#ED8932]" /> {user.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdmin && activeTab === 'billing' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-[#ED8932]/10 to-transparent">
                <p className="text-xs font-bold uppercase text-[#ED8932] mb-1">Status da Empresa</p>
                <h4 className="text-2xl font-bold text-white font-serif">Saudável</h4>
              </div>
              <div className="glass p-6 rounded-3xl border-white/5">
                <p className="text-xs font-bold uppercase text-slate-500 mb-1">Faturamento App</p>
                <h4 className="text-2xl font-bold text-white font-serif">{formatCurrency(12500)}</h4>
              </div>
            </div>

            <div className="glass rounded-3xl border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Receipt className="w-4 h-4 text-[#ED8932]" /> Faturas do Sistema</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[var(--brand-text-muted)] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Serviço</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/60">{formatDate(inv.date)}</td>
                      <td className="px-6 py-4 font-bold text-white">{inv.planName}</td>
                      <td className="px-6 py-4 font-bold text-[#ED8932]">{formatCurrency(inv.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          inv.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin && activeTab === 'management' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((client) => (
                <div key={client.id} className="glass p-6 rounded-3xl border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-white font-serif">{client.coupleNames}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#ED8932]/10 text-[#ED8932]">
                      {client.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{formatCurrency(client.contractValue)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSection;