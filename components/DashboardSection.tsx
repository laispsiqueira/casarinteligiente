
import React, { useState, useMemo, useEffect } from 'react';
import { useWedding } from '../context/WeddingContext';
import { 
  BarChart3, Users, CheckSquare, Heart, TrendingUp, Calendar, 
  ArrowUpRight, Clock, Search, ChevronDown, User, FileSpreadsheet,
  Wallet, XCircle, PieChart, BarChart4
} from 'lucide-react';
import { UserProfile } from '../types';
import { exportToCSV } from '../shared/utils/export';

const DashboardSection: React.FC = () => {
  const { tasks, user, availableUsers, invoices } = useWedding();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  const isAdminOrAssessor = user.role === 'Administrador' || user.role.includes('Assessor');
  
  const manageableCouples = useMemo(() => {
    return availableUsers.filter(u => {
      if (user.role === 'Administrador') return u.role.includes('Noivo');
      if (user.role.includes('Assessor')) return u.assessorId === user.id;
      return false;
    });
  }, [availableUsers, user]);

  const [selectedCouple, setSelectedCouple] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isAdminOrAssessor) {
      setSelectedCouple(user);
    } else if (!selectedCouple || !manageableCouples.find(c => c.id === selectedCouple.id)) {
      setSelectedCouple(manageableCouples[0] || null);
    }
  }, [user, isAdminOrAssessor, manageableCouples]);

  // Inteligência de Portfólio Financeiro
  const portfolioStats = useMemo(() => {
    if (!isAdminOrAssessor) return null;

    const myClientIds = new Set(manageableCouples.map(c => c.id));
    const myInvoices = invoices.filter(inv => inv.userId && myClientIds.has(inv.userId));
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const paidInvoices = myInvoices.filter(i => i.status === 'Pago');
    
    const monthlyRevenue = paidInvoices
      .filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, i) => acc + i.amount, 0);

    const annualRevenue = paidInvoices
      .filter(i => new Date(i.date).getFullYear() === currentYear)
      .reduce((acc, i) => acc + i.amount, 0);

    const pendingValue = myInvoices
      .filter(i => i.status === 'Pendente')
      .reduce((acc, i) => acc + i.amount, 0);

    const canceledInvoicesCount = myInvoices.filter(i => i.status === 'Cancelado').length;
    const totalClientsCount = manageableCouples.length;

    const quarters = [0, 0, 0, 0];
    paidInvoices.forEach(i => {
      const d = new Date(i.date);
      if (d.getFullYear() === currentYear) {
        const q = Math.floor(d.getMonth() / 3);
        quarters[q] += i.amount;
      }
    });

    return { monthlyRevenue, annualRevenue, pendingValue, canceledInvoicesCount, totalClientsCount, quarters };
  }, [manageableCouples, invoices, isAdminOrAssessor]);

  const filteredCouples = manageableCouples.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const coupleStats = useMemo(() => {
    if (!selectedCouple) return null;
    const seed = selectedCouple.id.length + (selectedCouple.name.length * 2);
    const totalGuests = 100 + (seed % 50);
    const confirmed = Math.floor(totalGuests * 0.45);
    const pending = totalGuests - confirmed - Math.floor(seed % 10);
    const totalTasks = 20 + (seed % 10);
    const completed = 8 + (seed % 5);
    const progress = (completed / totalTasks) * 100;

    return { totalGuests, confirmed, pending, totalTasks, completed, progress, daysToEvent: 120 + (seed % 30), budget: 50000 + (seed * 1000), paid: 20000 + (seed * 500) };
  }, [selectedCouple]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleExportTasks = () => {
    const dataToExport = tasks.map(t => ({
      Tarefa: t.title,
      Categoria: t.category,
      Status: t.completed ? 'Concluída' : 'Pendente'
    }));
    exportToCSV(dataToExport, `Tarefas_${selectedCouple?.name || 'Geral'}`);
  };

  const stats = [
    { label: 'Convidados Confirmados', value: coupleStats?.confirmed || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'RSVPs Pendentes', value: coupleStats?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Progresso do Plano', value: `${Math.round(coupleStats?.progress || 0)}%`, icon: CheckSquare, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Dias para o Evento', value: coupleStats?.daysToEvent || 0, icon: Calendar, color: 'text-[#ED8932]', bg: 'bg-[#ED8932]/10' },
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-6 py-10 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      
      {/* SEÇÃO DE PORTFÓLIO PARA ASSESSORES/ADMINS */}
      {isAdminOrAssessor && portfolioStats && (
        <div className="mb-12 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[var(--brand-text)] font-serif flex items-center gap-2 transition-colors">
              <TrendingUp className="text-[#ED8932] w-5 h-5" /> Saúde do seu Portfólio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Rec. Mensal', value: formatCurrency(portfolioStats.monthlyRevenue), color: 'text-emerald-500' },
              { label: 'Pendentes', value: formatCurrency(portfolioStats.pendingValue), color: 'text-amber-500' },
              { label: 'Cancelados', value: portfolioStats.canceledInvoicesCount, color: 'text-rose-500' },
              { label: 'Clientes', value: portfolioStats.totalClientsCount, color: 'text-sky-500' },
              { label: 'Anual', value: formatCurrency(portfolioStats.annualRevenue), color: 'text-[#ED8932]' },
              { label: 'Quarter', value: formatCurrency(portfolioStats.quarters[Math.floor(new Date().getMonth() / 3)]), color: 'text-indigo-500' }
            ].map((stat, i) => (
              <div key={i} className="glass p-4 rounded-2xl flex flex-col items-center text-center">
                <p className="text-[9px] font-bold text-[var(--brand-text-muted)] uppercase tracking-widest mb-1 transition-colors">{stat.label}</p>
                <p className={`text-sm font-bold ${stat.color} truncate w-full`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4 w-full md:w-auto">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif transition-colors">Status de Evento Individual</h1>
            <p className="text-[var(--brand-text-muted)] text-sm transition-colors">Resumo executivo do progresso do casal selecionado.</p>
          </div>

          {isAdminOrAssessor && (
            <div className="relative">
              <button 
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-3 bg-white/5 border border-[var(--sidebar-border)] px-4 py-2.5 rounded-2xl hover:bg-white/10 transition-all min-w-[280px]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#ED8932]/20 flex items-center justify-center text-[#ED8932] font-bold text-xs shrink-0">
                  {selectedCouple?.name[0]}
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[10px] text-[var(--brand-text-muted)] font-bold uppercase tracking-widest transition-colors">Visualizando Casal</p>
                  <p className="text-sm font-bold text-[var(--brand-text)] truncate transition-colors">{selectedCouple?.name}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--brand-text-muted)] transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectorOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSelectorOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-[var(--sidebar-border)]">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--brand-text-muted)]" />
                        <input type="text" placeholder="Buscar casal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-[var(--brand-text)] outline-none border border-transparent focus:border-[#ED8932]/30" />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                      {filteredCouples.map(couple => (
                        <button key={couple.id} onClick={() => { setSelectedCouple(couple); setIsSelectorOpen(false); }} className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-all text-left ${selectedCouple?.id === couple.id ? 'bg-[#ED8932]/10 border-l-2 border-[#ED8932]' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0"> {couple.name[0]} </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--brand-text)] transition-colors">{couple.name}</p>
                            <p className="text-[10px] text-[var(--brand-text-muted)] uppercase transition-colors">{couple.role} • {couple.plan}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-3xl transition-colors group">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-[var(--brand-text-muted)] font-medium mb-1 transition-colors">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[var(--brand-text)] transition-colors">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-[var(--brand-text)] flex items-center gap-2 transition-colors">
                <CheckSquare className="w-4 h-4 text-sky-500" /> Tarefas Recentes
              </h3>
              <button 
                onClick={handleExportTasks}
                className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 text-sky-500 rounded-lg text-[10px] font-bold uppercase hover:bg-sky-500/20 transition-all"
              >
                <FileSpreadsheet className="w-3 h-3" /> Exportar Tarefas
              </button>
            </div>
            
            <div className="w-full h-3 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full" style={{ width: `${coupleStats?.progress || 0}%` }} />
            </div>

            <div className="space-y-4">
              {tasks.length > 0 ? tasks.slice(0, 10).map((task, i) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-[var(--sidebar-border)]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    <span className={`text-sm truncate transition-colors ${task.completed ? 'text-[var(--brand-text-muted)] line-through' : 'text-[var(--brand-text)]'}`}> {task.title} </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[var(--brand-text-muted)] shrink-0 ml-2 transition-colors">{task.category}</span>
                </div>
              )) : (
                <div className="text-center py-10 opacity-20 italic text-sm text-[var(--brand-text)] transition-colors">Nenhuma tarefa para exibir.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-[#ED8932] uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Investimento Estimado
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-[var(--brand-text-muted)] transition-colors">Total Previsto</p>
              <p className="text-2xl font-bold text-[var(--brand-text)] font-serif transition-colors">{formatCurrency(coupleStats?.budget || 0)}</p>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ED8932] rounded-full" style={{ width: `${((coupleStats?.paid || 0) / (coupleStats?.budget || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
