
import React, { useState } from 'react';
import { Guest } from '../types';
import { Users, Send, CheckCircle, MessageSquare, Plus, Trash2, Smartphone, Sparkles } from 'lucide-react';

const GuestSection: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Maria Silva', status: 'Confirmado', notified: true },
    { id: '2', name: 'João Souza', status: 'Pendente', notified: false },
  ]);
  const [newName, setNewName] = useState('');

  const addGuest = () => {
    if (!newName.trim()) return;
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newName,
      status: 'Pendente',
      notified: false
    };
    setGuests([...guests, newGuest]);
    setNewName('');
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const toggleNotify = (id: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, notified: !g.notified } : g));
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Smartphone className="text-rose-400" />
            Gestão de Convidados
          </h1>
          <p className="text-slate-400 text-sm">Automação de WhatsApp e RSVP inteligente.</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-400 text-xs font-bold">
          {guests.length} Convidados
        </div>
      </div>

      <div className="relative mb-8">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGuest()}
          placeholder="Nome do convidado..."
          className="w-full glass rounded-2xl py-4 px-6 outline-none border-white/5 focus:border-rose-500/30 transition-all text-white"
        />
        <button 
          onClick={addGuest}
          className="absolute right-3 top-2.5 p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-400 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-2">
        {guests.map(guest => (
          <div key={guest.id} className="group flex items-center justify-between p-4 glass rounded-2xl border-white/5 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                guest.status === 'Confirmado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {guest.name[0]}
              </div>
              <div>
                <p className="font-bold text-slate-200">{guest.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    guest.status === 'Confirmado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {guest.status}
                  </span>
                  {guest.notified && (
                    <span className="flex items-center gap-1 text-[10px] text-sky-400 font-bold">
                      <MessageSquare className="w-3 h-3" /> WhatsApp Enviado
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleNotify(guest.id)}
                className={`p-2.5 rounded-xl transition-all ${
                  guest.notified ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:bg-white/10'
                }`}
                title="Simular Notificação"
              >
                <Send className="w-4 h-4" />
              </button>
              <button 
                onClick={() => removeGuest(guest.id)}
                className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 glass rounded-[2rem] border-rose-500/20 bg-rose-500/[0.03]">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          Insight da Vanessa
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Noivas que usam nossas Notificações Automatizadas economizam até 15 horas mensais em contato manual e reduzem o risco de esquecer convidados importantes.
        </p>
      </div>
    </div>
  );
};

export default GuestSection;
