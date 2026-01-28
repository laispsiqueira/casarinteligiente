
import React, { useState, useMemo, useEffect } from 'react';
import { useWedding } from '../context/WeddingContext';
import { BarChart3, Users, CheckSquare, Heart, TrendingUp, Calendar, ArrowUpRight, Clock, Search, ChevronDown, User } from 'lucide-react';
import { UserProfile } from '../types';

const DashboardSection: React.FC = () => {
  const { tasks, user, availableUsers } = useWedding();
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

  // Sincroniza o casal selecionado inicialmente ou quando o usuário do contexto muda
  useEffect(() => {
    if (!isAdminOrAssessor) {
      setSelectedCouple(user);
    } else if (!selectedCouple || !manageableCouples.find(c => c.id === selectedCouple.id)) {
      setSelectedCouple(manageableCouples[0] || null);
    }
  }, [user, isAdminOrAssessor, manageableCouples]);

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

    return {
      totalGuests,
      confirmed,
      pending,
      totalTasks,
      completed,
      progress,
      daysToEvent: 120 + (seed % 30),
      budget: 50000 + (seed * 1000),
      paid: 20000 + (seed * 500)
    };
  }, [selectedCouple]);

  if (!selectedCouple && isAdminOrAssessor) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10 animate-in fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-xl font-serif text-white mb-2">Nenhum casal vinculado</h2>
        <p className="text-slate-500 max-w-xs text-sm">Você ainda não possui noivos vinculados ao seu perfil.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Convidados Confirmados', value: coupleStats?.confirmed || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'RSVPs Pendentes', value: coupleStats?.pending || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Progresso do Plano', value: `${Math.round(coupleStats?.progress || 0)}%`, icon: CheckSquare, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Dias para o Evento', value: coupleStats?.daysToEvent || 0, icon: Calendar, color: 'text-[#ED8932]', bg: 'bg-[#ED8932]/10' },
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-6 py-10 overflow-hidden animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4 w-full md:w-auto">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif">Painel de Noivos</h1>
            <p className="text-[var(--brand-text-muted)] text-sm">Resumo executivo do progresso e saúde do evento.</p>
          </div>

          {isAdminOrAssessor && (
            <div className="relative">
              <button 
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl hover:bg-white/10 transition-all min-w-[280px]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#ED8932]/20 flex items-center justify-center text-[#ED8932] font-bold text-xs shrink-0">
                  {selectedCouple?.name[0]}
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Visualizando Casal</p>
                  <p className="text-sm font-bold text-white truncate">{selectedCouple?.name}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectorOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSelectorOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-2 glass border border-[#ED8932]/20 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-white/5">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Buscar casal..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none border border-transparent focus:border-[#ED8932]/30"
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                      {filteredCouples.map(couple => (
                        <button 
                          key={couple.id}
                          onClick={() => {
                            setSelectedCouple(couple);
                            setIsSelectorOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-all text-left ${selectedCouple?.id === couple.id ? 'bg-[#ED8932]/10 border-l-2 border-[#ED8932]' : ''}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                            {couple.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{couple.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{couple.role} • {couple.plan}</p>
                          </div>
                        </button>
                      ))}
                      {filteredCouples.length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-500 italic">Nenhum casal encontrado.</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-[#ED8932] uppercase tracking-widest mb-1">Evento em</p>
          <p className="text-lg font-serif text-white">{selectedCouple?.weddingDate || 'Data a definir'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-white/10 transition-colors group">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-[var(--brand-text-muted)] font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-sky-400" /> Status das Tarefas
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                {coupleStats?.completed || 0}/{coupleStats?.totalTasks || 0} concluídas
              </span>
            </div>
            
            <div className="w-full h-3 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${coupleStats?.progress || 0}%` }} 
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {tasks.length > 0 ? tasks.slice(0, 10).map((task, i) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${i < (coupleStats?.completed || 0) ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className={`text-sm truncate ${i < (coupleStats?.completed || 0) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 shrink-0 ml-2">{task.category}</span>
                </div>
              )) : (
                <div className="text-center py-10 opacity-20 italic text-sm">Carregando tarefas do planejamento...</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto no-scrollbar pb-10">
          <div className="glass p-6 rounded-3xl border-white/5">
            <h3 className="text-xs font-bold text-[#ED8932] uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Investimento Estimado
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-400">Total Previsto</p>
                  <p className="text-2xl font-bold text-white font-serif">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupleStats?.budget || 0)}
                  </p>
                </div>
                <div className="flex items-center text-emerald-400 text-xs font-bold gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3 h-3" /> {Math.round(((coupleStats?.paid || 0) / (coupleStats?.budget || 1)) * 100)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Pago: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(coupleStats?.paid || 0)}</span>
                  <span>{Math.round(((coupleStats?.paid || 0) / (coupleStats?.budget || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#ED8932] rounded-full transition-all duration-700" 
                    style={{ width: `${((coupleStats?.paid || 0) / (coupleStats?.budget || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-[#402005]/40 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#ED8932] rounded-lg shadow-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Status da Assessoria</p>
                <p className="text-[9px] text-white/50 uppercase">Canal de Suporte Direto</p>
              </div>
            </div>
            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-slate-300 leading-relaxed italic">
                {user.role.includes('Assessor') 
                  ? "Você está monitorando este casal. Use a consultoria para ajustar detalhes técnicos."
                  : "Vanessa está analisando seus últimos orçamentos. Foco total em Buffet esta semana."}
              </p>
            </div>
            {user.role.includes('Assessor') && (
              <button className="w-full mt-4 py-2 bg-[#ED8932] text-white rounded-xl text-[10px] font-bold uppercase hover:bg-[#d97c2a] transition-all">
                Enviar Nota ao Casal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
