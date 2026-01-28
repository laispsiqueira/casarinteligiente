import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { User, CreditCard, Users, ShieldCheck, Mail, Calendar, Trash2, Edit2, Plus, X, Lock, Eye, ChevronRight, UserPlus } from 'lucide-react';
import { AppMode, UserProfile } from '../types';

const AccountSection: React.FC = () => {
  const { 
    user, setUser, originalAdmin, setOriginalAdmin, 
    invoices, availableUsers, setAvailableUsers, setMode 
  } = useWedding();
  
  const isAdminReal = (originalAdmin?.role || user.role) === 'Administrador';
  const isAssessor = user.role === 'Assessor';
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'management'>('profile');
  
  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weddingDate: '',
    role: 'Noivo+' as any,
    plan: 'Simplifier' as any
  });

  const myCouples = availableUsers.filter(u => {
    if (isAdminReal && !originalAdmin) return u.role.includes('Noivo'); 
    if (isAssessor) return u.assessorId === user.id; 
    return false;
  });

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User, hidden: false },
    { id: 'billing', label: 'Faturamento Global', icon: CreditCard, hidden: !isAdminReal || !!originalAdmin },
    { id: 'management', label: isAssessor ? 'Meus Noivos' : 'Painel de Usuários', icon: Users, hidden: !isAdminReal && !isAssessor },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const handleImpersonate = (targetUser: any) => {
    if (!originalAdmin) {
      setOriginalAdmin(user);
    }
    setUser(targetUser);
    setMode(AppMode.CHAT);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', weddingDate: '', role: 'Noivo+', plan: 'Simplifier' });
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setFormData({ 
      name: u.name, 
      email: u.email, 
      weddingDate: u.weddingDate || '', 
      role: u.role, 
      plan: u.plan 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este perfil? Esta ação não pode ser desfeita.')) {
      setAvailableUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setAvailableUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        ...formData,
        createdAt: Date.now(),
        assessorId: isAssessor ? user.id : undefined
      };
      setAvailableUsers(prev => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-6 py-10 overflow-hidden relative">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif">
            {originalAdmin ? 'Modo de Visualização' : 'Minha Conta'}
          </h1>
          <p className="text-[var(--brand-text-muted)] text-sm">
            {originalAdmin 
              ? `Você está explorando o app como ${user.name}` 
              : `Gerencie seu perfil de ${user.role.toLowerCase()}.`}
          </p>
        </div>
        {(isAdminReal || isAssessor) && activeTab === 'management' && !originalAdmin && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#ED8932] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-all"
          >
            <UserPlus className="w-4 h-4" /> {isAssessor ? 'Novo Noivo' : 'Novo Usuário'}
          </button>
        )}
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
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass p-8 rounded-3xl border-white/5 flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#402005] to-[#ED8932] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-2xl relative">
                {user.name[0]}
                {originalAdmin && (
                  <div className="absolute -top-2 -right-2 bg-sky-500 p-1.5 rounded-full shadow-lg border-2 border-[var(--brand-bg)]">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                )}
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
            
            {/* Removido a aba de perfil profissional do assessor conforme solicitado */}
          </div>
        )}

        {isAdminReal && activeTab === 'billing' && !originalAdmin && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-[#ED8932]/10 to-transparent">
                <p className="text-xs font-bold uppercase text-[#ED8932] mb-1">Receita Mensal</p>
                <h4 className="text-2xl font-bold text-white font-serif">{formatCurrency(invoices.reduce((acc, inv) => acc + inv.amount, 0))}</h4>
              </div>
              <div className="glass p-6 rounded-3xl border-white/5">
                <p className="text-xs font-bold uppercase text-slate-500 mb-1">Usuários Totais</p>
                <h4 className="text-2xl font-bold text-white font-serif">{availableUsers.length}</h4>
              </div>
            </div>

            <div className="glass rounded-3xl border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#ED8932]" /> Fluxo de Caixa Global</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[var(--brand-text-muted)] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => {
                    const invUser = availableUsers.find(u => u.id === inv.userId);
                    return (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-white/60">{formatDate(inv.date)}</td>
                        <td className="px-6 py-4 text-white font-medium">{invUser?.name || 'Sistema'}</td>
                        <td className="px-6 py-4 font-bold text-white">{inv.planName}</td>
                        <td className="px-6 py-4 font-bold text-[#ED8932]">{formatCurrency(inv.amount)}</td>
                        <td className="px-6 py-4">
                           <button className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 rounded-lg text-white hover:bg-[#ED8932]/20 transition-all">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(isAdminReal || isAssessor) && activeTab === 'management' && !originalAdmin && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-serif text-white">
              {isAdminReal ? 'Gestão de Usuários do Sistema' : 'Meus Noivos Vinculados'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCouples.map((couple) => (
                <div key={couple.id} className="glass p-6 rounded-3xl border-white/5 hover:border-[#ED8932]/30 transition-all relative group/card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-white font-serif">{couple.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{couple.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#ED8932]/10 text-[#ED8932]">
                        {couple.plan}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--brand-text-muted)] border-t border-white/5 pt-4 mb-4">
                    <Calendar className="w-4 h-4 text-[#ED8932]" />
                    {couple.weddingDate || 'Data não definida'}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleImpersonate(couple)}
                      className="flex-1 py-2 bg-[#ED8932]/10 hover:bg-[#ED8932]/20 rounded-xl text-[10px] font-bold text-[#ED8932] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> Acessar
                    </button>
                    <button 
                      onClick={() => openEditModal(couple)}
                      className="p-2 bg-white/5 hover:bg-sky-500/10 text-sky-400 rounded-xl transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(couple.id)}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {myCouples.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-serif">Nenhum noivo encontrado.</p>
                  <button onClick={openAddModal} className="mt-4 text-[#ED8932] text-sm font-bold underline">Adicionar meu primeiro casal</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass w-full max-w-lg rounded-[2.5rem] border-[#ED8932]/20 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-white">{editingUser ? 'Editar Perfil' : 'Novo Perfil'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Nomes do Casal / Usuário</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#ED8932]/40"
                  placeholder="Ex: Roberto & Julia"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">E-mail de Acesso</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#ED8932]/40"
                  placeholder="contato@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Data do Casamento</label>
                  <input 
                    type="date"
                    value={formData.weddingDate}
                    onChange={e => setFormData({...formData, weddingDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#ED8932]/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Papel</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as any})}
                    className="w-full bg-[#1a0d02] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#ED8932]/40 appearance-none"
                  >
                    <option value="Noivo+">Noivo+</option>
                    <option value="Noivo Free">Noivo Free</option>
                    {isAdminReal && <option value="Assessor">Assessor</option>}
                    {isAdminReal && <option value="Administrador">Administrador</option>}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Plano Ativo</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Free', 'Simplifier', 'Enterprise'].map(p => (
                    <button 
                      key={p} type="button"
                      onClick={() => setFormData({...formData, plan: p as any})}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${formData.plan === p ? 'bg-[#ED8932] text-white border-transparent' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#ED8932] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#ED8932]/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingUser ? 'Salvar Alterações' : 'Criar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSection;