import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { BarChart3, Users, CheckSquare, Heart, TrendingUp, Calendar, ArrowUpRight, Clock } from 'lucide-react';

const DashboardSection: React.FC = () => {
  const { guests, tasks, user } = useWedding();
  
  const confirmedCount = guests.filter(g => g.status === 'Confirmado').length;
  const pendingCount = guests.filter(g => g.status === 'Pendente').length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const stats = [
    { label: 'Convidados Confirmados', value: confirmedCount, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'RSVPs Pendentes', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Progresso do Plano', value: `${Math.round(progress)}%`, icon: CheckSquare, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Dias para o Evento', value: '142', icon: Calendar, color: 'text-[#ED8932]', bg: 'bg-[#ED8932]/10' },
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="mb-10 flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif">Painel de Noivos</h1>
          <p className="text-[var(--brand-text-muted)] text-sm">Resumo executivo do progresso e saúde do evento.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-[#ED8932] uppercase tracking-widest mb-1">Casamento de</p>
          <p className="text-lg font-serif text-white">Carla & Marcos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-white/10 transition-colors">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
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
            <h3 className="text-sm font-bold text-white mb-6 flex items-center justify-between">
              Status das Tarefas 
              <span className="text-xs text-slate-500 font-normal">{completedTasks}/{tasks.length} concluídas</span>
            </h3>
            <div className="w-full h-3 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{task.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto no-scrollbar pb-10">
          <div className="glass p-6 rounded-3xl border-white/5">
            <h3 className="text-xs font-bold text-[#ED8932] uppercase tracking-widest mb-4">Investimento</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-400">Total Previsto</p>
                  <p className="text-2xl font-bold text-white font-serif">R$ 85.000</p>
                </div>
                <div className="flex items-center text-emerald-400 text-xs font-bold gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> 12%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Pago: R$ 32.500</span>
                  <span>40%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full">
                  <div className="h-full bg-[#ED8932] rounded-full w-[40%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-[#402005] to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#ED8932] rounded-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Assessor Online</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">"Estamos dentro do cronograma. O foco desta semana é a degustação do buffet."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;