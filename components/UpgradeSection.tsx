
import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { AppMode } from '../types';
import { Check, Sparkles, Heart, Shield, Crown } from 'lucide-react';

const UpgradeSection: React.FC = () => {
  const { user, setMode } = useWedding();
  const isAssessor = user.role.includes('Assessor');

  const plans = isAssessor ? [
    { name: 'Assessor Free', price: 'R$ 0', features: ['Até 1 Casal Ativo', 'Estúdio de Design', 'Consultoria Vanessa', 'Planejamento Base'], current: user.role === 'Assessor Free' },
    { name: 'Assessor Plus', price: 'R$ 197/mês', features: ['Até 20 Casais Ativos', 'Painel de Gestão Completo', 'RSVP Automatizado', 'Suporte Prioritário'], bestSeller: true, current: user.role === 'Assessor Plus' },
    { name: 'Assessor Premium', price: 'R$ 397/mês', features: ['Até 50 Casais Ativos', 'White Label (Sua Marca)', 'Relatórios de Performance', 'Exportação para PDF/Excel'], current: user.role === 'Assessor Premium' },
  ] : [
    { name: 'Noivo Free', price: 'R$ 0', features: ['Consultoria Vanessa', 'Estúdio de Design', 'Planejamento Básico'], current: user.role === 'Noivo Free' },
    { name: 'Noivo Plus', price: 'R$ 47/mês', features: ['Gestão de Convidados', 'RSVP Inteligente', 'Busca de Fornecedores', 'Planejamento Ilimitado'], bestSeller: true, current: user.role === 'Noivo+' },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-6 py-10 overflow-y-auto no-scrollbar">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold text-white font-serif">Escolha o plano ideal para o seu sucesso</h1>
        <p className="text-slate-400 max-w-2xl mx-auto italic">Libere todo o poder da inteligência artificial Vanessa e garanta que nada saia do planejado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative glass rounded-[2.5rem] p-8 border ${plan.bestSeller ? 'border-[#ED8932] shadow-2xl shadow-[#ED8932]/10 scale-105' : 'border-white/5'} transition-all flex flex-col`}
          >
            {plan.bestSeller && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ED8932] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Mais Recomendado
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-serif text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{plan.price.split('/')[0]}</span>
                <span className="text-slate-500 text-sm font-medium">{plan.price.includes('/') ? `/${plan.price.split('/')[1]}` : ''}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.bestSeller ? 'bg-[#ED8932]/20 text-[#ED8932]' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              disabled={plan.current}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                plan.current 
                ? 'bg-slate-800 text-slate-500 cursor-default' 
                : 'bg-[#ED8932] text-white hover:scale-[1.02] shadow-xl shadow-[#ED8932]/20'
              }`}
            >
              {plan.current ? 'Plano Atual' : 'Começar Agora'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
        <div className="text-center space-y-2">
          <Shield className="w-8 h-8 text-[#ED8932] mx-auto mb-2" />
          <h4 className="text-white font-serif">Segurança Total</h4>
          <p className="text-xs text-slate-500">Seus dados protegidos com criptografia de ponta a ponta.</p>
        </div>
        <div className="text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#ED8932] mx-auto mb-2" />
          <h4 className="text-white font-serif">IA Consultiva</h4>
          <p className="text-xs text-slate-500">Vanessa disponível 24/7 para tirar suas dúvidas.</p>
        </div>
        <div className="text-center space-y-2">
          <Crown className="w-8 h-8 text-[#ED8932] mx-auto mb-2" />
          <h4 className="text-white font-serif">Experiência VIP</h4>
          <p className="text-xs text-slate-500">Acesso antecipado a novas funcionalidades do Simplifier.</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeSection;
