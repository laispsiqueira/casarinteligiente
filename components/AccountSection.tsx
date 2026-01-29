
import React, { useState, useMemo } from 'react';
import { useWedding } from '../context/WeddingContext';
import { 
  User, CreditCard, Users, ShieldCheck, Mail, Calendar, 
  Trash2, Edit2, Plus, X, Lock, Eye, ChevronRight, 
  UserPlus, Search, Filter, ArrowUpDown, MoreHorizontal,
  TrendingUp, Wallet, XCircle, PieChart, BarChart4,
  FileSpreadsheet, Download
} from 'lucide-react';
import { AppMode, UserProfile, Invoice } from '../types';
import { exportToCSV } from '../shared/utils/export';

const AccountSection: React.FC = () => {
  const { 
    user, setUser, originalAdmin, setOriginalAdmin, 
    invoices, availableUsers, setAvailableUsers, setMode 
  } = useWedding();
  
  const isAdminReal = (originalAdmin?.role || user.role) === 'Administrador';
  const isAssessor = user.role.includes('Assessor');
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'management'>('profile');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [billingSearchQuery, setBillingSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weddingDate: '',
    role: 'Noivo+' as any,
    plan: 'Simplifier' as any
  });

  const filteredUsers = useMemo(() => {
    if (!isAdminReal) return [];
    const query = adminSearchQuery.toLowerCase();
    return availableUsers.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query) ||
      u.plan.toLowerCase().includes(query)
    );
  }, [availableUsers, adminSearchQuery, isAdminReal]);

  const filteredInvoices = useMemo(() => {
    if (!isAdminReal) return [];
    const query = billingSearchQuery.toLowerCase();
    return invoices.filter(inv => {
      const invUser = availableUsers.find(u => u.id === inv.userId);
      return (
        invUser?.name.toLowerCase().includes(query) ||
        invUser?.email.toLowerCase().includes(query) ||
        inv.planName.toLowerCase().includes(query) ||
        inv.method.toLowerCase().includes(query)
      );
    });
  }, [invoices, billingSearchQuery, availableUsers, isAdminReal]);

  const financeStats = useMemo(() => {
    if (!isAdminReal) return null;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const paidInvoices = invoices.filter(i => i.status === 'Pago');
    
    const monthlyRevenue = paidInvoices
      .filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, i) => acc + i.amount, 0);

    const annualRevenue = paidInvoices
      .filter(i => new Date(i.date).getFullYear() === currentYear)
      .reduce((acc, i) => acc + i.amount, 0);

    const pendingValue = invoices
      .filter(i => i.status === 'Pendente')
      .reduce((acc, i) => acc + i.amount, 0);

    const canceledInvoicesCount = invoices.filter(i => i.status === 'Cancelado').length;
    const totalClientsCount = availableUsers.filter(u => u.role !== 'Administrador').length;

    const quarters = [0, 0, 0, 0];
    paidInvoices.forEach(i => {
      const d = new Date(i.date);
      if (d.getFullYear() === currentYear) {
        const q = Math.floor(d.getMonth() / 3);
        quarters[q] += i.amount;
      }
    });

    return { monthlyRevenue, annualRevenue, pendingValue, canceledInvoicesCount, totalClientsCount, quarters };
  }, [invoices, availableUsers, isAdminReal]);

  const handleExportUsers = () => {
    const dataToExport = filteredUsers.map(u => ({
      Nome: u.name,
      Email: u.email,
      Papel: u.role,
      Plano: u.plan,
      Data_Cadastro: new Date(u.createdAt).toLocaleDateString('pt-BR'),
      Data_Evento: u.weddingDate || 'N/A'
    }));
    exportToCSV(dataToExport, 'Gestao_Clientes');
  };

  const handleExportInvoices = () => {
    const dataToExport = filteredInvoices.map(inv => {
      const invUser = availableUsers.find(u => u.id === inv.userId);
      return {
        Data: new Date(inv.date).toLocaleDateString('pt-BR'),
        Cliente: invUser?.name || 'Sistema',
        Email: invUser?.email || 'N/A',
        Plano: inv.planName,
        Status: inv.status,
        Metodo: inv.method,
        Valor: inv.amount
      };
    });
    exportToCSV(dataToExport, 'Faturamento_Global');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User, hidden: false },
    { id: 'billing', label: 'Faturamento Global', icon: CreditCard, hidden: !isAdminReal || !!originalAdmin },
    { id: 'management', label: isAssessor ? 'Meus Noivos' : 'Gestão de Clientes', icon: Users, hidden: !isAdminReal && !isAssessor },
  ];

  const handleImpersonate = (targetUser: any) => {
    if (!originalAdmin) setOriginalAdmin(user);
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
      name: u.name, email: u.email, weddingDate: u.weddingDate || '', 
      role: u.role, plan: u.plan 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir perfil?')) setAvailableUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setAvailableUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`, ...formData, createdAt: Date.now(), assessorId: isAssessor ? user.id : undefined
      };
      setAvailableUsers(prev => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full px-6 py-10 overflow-hidden relative">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif transition-colors">
            {originalAdmin ? 'Modo de Visualização' : activeTab === 'billing' ? 'Inteligência Financeira' : 'Configurações'}
          </h1>
          <p className="text-[var(--brand-text-muted)] text-sm transition-colors">
            {originalAdmin 
              ? `Explorando como ${user.name}` 
              : activeTab === 'billing' ? 'Dashboard de faturamento global e fluxo de caixa.' : `Gerencie seu perfil de ${user.role.toLowerCase()}.`}
          </p>
        </div>
        
        {activeTab === 'billing' && isAdminReal && (
          <div className="flex-1 w-full md:max-w-md relative animate-in fade-in slide-in-from-top-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-text-muted)]" />
            <input 
              type="text"
              placeholder="Filtrar por nome de cliente, email ou plano..."
              value={billingSearchQuery}
              onChange={(e) => setBillingSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-[var(--sidebar-border)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--brand-text)] outline-none focus:border-[#ED8932]/30 transition-all placeholder:text-[var(--brand-text-muted)] shadow-inner"
            />
          </div>
        )}

        {(isAdminReal || isAssessor) && activeTab === 'management' && !originalAdmin && (
          <button onClick={openAddModal} className="flex items-center gap-2 bg-[#ED8932] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
            <Plus className="w-4 h-4" /> Adicionar Usuário
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-[var(--sidebar-border)] h-fit">
          {tabs.filter(t => !t.hidden).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#ED8932] text-white shadow-lg' 
                  : 'text-[var(--brand-text-muted)] hover:text-[var(--brand-text)] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {isAdminReal && activeTab === 'management' && (
          <div className="flex-1 min-w-[300px] relative animate-in fade-in slide-in-from-left-4 duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-text-muted)]" />
            <input 
              type="text"
              placeholder="Buscar por nome, e-mail, papel ou plano..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-[var(--sidebar-border)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--brand-text)] outline-none focus:border-[#ED8932]/30 transition-all placeholder:text-[var(--brand-text-muted)]"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass p-8 rounded-3xl flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#402005] to-[#ED8932] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-2xl relative">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-3xl" /> : user.name[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[var(--brand-text)] font-serif transition-colors">{user.name}</h2>
                <div className="flex items-center gap-3 text-sm text-[var(--brand-text-muted)] transition-colors">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#ED8932]" /> {user.email}</span>
                  <span className="w-1 h-1 bg-current opacity-20 rounded-full" />
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#ED8932]" /> {user.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && isAdminReal && !originalAdmin && financeStats && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-500 mb-2 tracking-widest">Receita Mensal</p>
                  <h4 className="text-3xl font-bold text-[var(--brand-text)] font-serif">{formatCurrency(financeStats.monthlyRevenue)}</h4>
                  <p className="text-[9px] text-[var(--brand-text-muted)] mt-2 font-bold uppercase">Competência Atual</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="glass p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-amber-500 mb-2 tracking-widest">Valor Pendente</p>
                  <h4 className="text-3xl font-bold text-[var(--brand-text)] font-serif">{formatCurrency(financeStats.pendingValue)}</h4>
                  <p className="text-[9px] text-[var(--brand-text-muted)] mt-2 font-bold uppercase">Boletos e Pix aguardando</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="glass p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 to-transparent flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-rose-500 mb-2 tracking-widest">Contas Canceladas</p>
                  <h4 className="text-3xl font-bold text-[var(--brand-text)] font-serif">{financeStats.canceledInvoicesCount}</h4>
                  <p className="text-[9px] text-[var(--brand-text-muted)] mt-2 font-bold uppercase">Faturas Não Pagas</p>
                </div>
                <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass p-8 rounded-3xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--brand-text)] flex items-center gap-2">
                      <BarChart4 className="w-4 h-4 text-[#ED8932]" /> Receita por Quarter ({new Date().getFullYear()})
                    </h3>
                    <p className="text-[10px] text-[var(--brand-text-muted)] uppercase mt-1">Desempenho Trimestral</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#ED8932] uppercase">Total Anual</p>
                    <p className="text-lg font-bold text-[var(--brand-text)]">{formatCurrency(financeStats.annualRevenue)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Q1 (Jan-Mar)', 'Q2 (Abr-Jun)', 'Q3 (Jul-Set)', 'Q4 (Out-Dez)'].map((label, idx) => {
                    const value = financeStats.quarters[idx];
                    const percentage = financeStats.annualRevenue > 0 ? (value / financeStats.annualRevenue) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-[var(--brand-text-muted)]">{label}</span>
                          <span className="text-[var(--brand-text)] font-bold">{formatCurrency(value)}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#ED8932] to-[#402005] rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-[#ED8932]/10 rounded-full flex items-center justify-center mb-4 border border-[#ED8932]/20">
                  <Users className="w-10 h-10 text-[#ED8932]" />
                </div>
                <h4 className="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-widest mb-2">Público Ativo</h4>
                <div className="text-5xl font-bold text-[var(--brand-text)] font-serif mb-2">{financeStats.totalClientsCount}</div>
                <p className="text-xs text-[var(--brand-text-muted)] max-w-[200px]">Usuários pagantes e trial (Exclui Administradores)</p>
              </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-[var(--sidebar-border)] bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[var(--brand-text)] flex items-center gap-2 transition-colors">Fluxo de Caixa Detalhado</h3>
                <button 
                  onClick={handleExportInvoices}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Exportar Excel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/20 text-[var(--brand-text-muted)] uppercase font-bold tracking-[0.15em] border-b border-[var(--sidebar-border)]">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Cliente / E-mail</th>
                      <th className="px-6 py-4">Plano</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Método</th>
                      <th className="px-6 py-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sidebar-border)]">
                    {filteredInvoices.map((inv) => {
                      const invUser = availableUsers.find(u => u.id === inv.userId);
                      return (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-[var(--brand-text-muted)] font-medium">{formatDate(inv.date)}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-[var(--brand-text)]">{invUser?.name || 'Sistema'}</p>
                            <p className="text-[10px] text-[var(--brand-text-muted)] lowercase">{invUser?.email || 'automático'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-white/5 rounded-lg text-[var(--brand-text)] font-bold">{inv.planName}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px] ${
                              inv.status === 'Pago' ? 'text-emerald-500' :
                              inv.status === 'Pendente' ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Pago' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : inv.status === 'Pendente' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[var(--brand-text-muted)]">{inv.method}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-sm font-bold ${inv.status === 'Pago' ? 'text-[var(--brand-text)]' : 'text-[var(--brand-text-muted)]'}`}>
                              {formatCurrency(inv.amount)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && !originalAdmin && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {isAdminReal ? (
              <div className="glass rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-[var(--sidebar-border)] bg-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[var(--brand-text)]">Usuários da Plataforma</h3>
                  <button 
                    onClick={handleExportUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Exportar Excel
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[var(--brand-text-muted)] uppercase font-bold tracking-widest border-b border-[var(--sidebar-border)]">
                      <tr>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Papel / Plano</th>
                        <th className="px-6 py-4">Data Cadastro</th>
                        <th className="px-6 py-4">Casamento / Assinatura</th>
                        <th className="px-6 py-4">Status Pgto</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--sidebar-border)]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-all group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#402005] flex items-center justify-center text-[#ED8932] font-bold text-[10px] shrink-0">
                                {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover rounded-lg" /> : u.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-[var(--brand-text)]">{u.name}</p>
                                <p className="text-[10px] text-[var(--brand-text-muted)] lowercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                u.role.includes('Admin') ? 'bg-sky-500/10 text-sky-500' :
                                u.role.includes('Assessor') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#ED8932]/10 text-[#ED8932]'
                              }`}>
                                {u.role}
                              </span>
                              <p className="text-[10px] text-[var(--brand-text-muted)] font-medium pl-1">Plano: {u.plan}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[var(--brand-text-muted)] font-medium">{formatDate(u.createdAt)}</td>
                          <td className="px-6 py-4 text-[var(--brand-text)] font-serif">{u.weddingDate || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${u.plan === 'Free' ? 'text-amber-500' : 'text-emerald-500'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${u.plan === 'Free' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              {u.plan === 'Free' ? 'Pendente' : 'Regular'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleImpersonate(u)} className="p-2 bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white rounded-lg transition-all" title="Acessar conta"><Eye className="w-3.5 h-3.5" /></button>
                              <button onClick={() => openEditModal(u)} className="p-2 bg-white/5 hover:bg-white/10 text-[var(--brand-text)] rounded-lg transition-all" title="Editar"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDelete(u.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableUsers.filter(u => u.assessorId === user.id).map((couple) => (
                  <div key={couple.id} className="glass p-6 rounded-3xl transition-all relative group/card">
                    <h4 className="font-bold text-[var(--brand-text)] font-serif transition-colors">{couple.name}</h4>
                    <p className="text-[10px] text-[var(--brand-text-muted)] uppercase tracking-widest transition-colors">{couple.role}</p>
                    <div className="mt-4 flex gap-2">
                       <button onClick={() => handleImpersonate(couple)} className="flex-1 py-2 bg-[#ED8932]/10 rounded-xl text-[10px] font-bold text-[#ED8932]">Acessar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass w-full max-w-lg rounded-[2.5rem] border-[#ED8932]/20 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-[var(--brand-text)]">{editingUser ? 'Editar Perfil' : 'Novo Perfil'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6 text-[var(--brand-text-muted)]" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase px-1">Nome Completo</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-[var(--sidebar-border)] rounded-2xl p-4 text-[var(--brand-text)] outline-none focus:border-[#ED8932]/40" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase px-1">E-mail</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-[var(--sidebar-border)] rounded-2xl p-4 text-[var(--brand-text)] outline-none focus:border-[#ED8932]/40" />
              </div>
              <button type="submit" className="w-full bg-[#ED8932] text-white py-4 rounded-2xl font-bold shadow-xl">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSection;
