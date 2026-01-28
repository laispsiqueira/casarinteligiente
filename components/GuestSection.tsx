
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Users, Send, MessageSquare, Plus, Trash2, Smartphone, Sparkles } from 'lucide-react';

const GuestSection: React.FC = () => {
  const { guests, setGuests } = useWedding();
  const [newName, setNewName] = useState('');

  const addGuest = () => {
    if (!newName.trim()) return;
    setGuests(prev => [...prev, { id: Date.now().toString(), name: newName, status: 'Pendente', notified: false }]);
    setNewName('');
  };

  const removeGuest = (id: string) => setGuests(prev => prev.filter(g => g.id !== id));
  const toggleNotify = (id: string) => setGuests(prev => prev.map(g => g.id === id ? { ...g, notified: !g.notified } : g));

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Smartphone className="text-rose-400" /> Gestão de Convidados</h1>
          <p className="text-slate-400 text-sm">Automação e controle de RSVP.</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-400 font-bold">{guests.length} Convidados</div>
      </div>

      <div className="relative mb-8">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGuest()} placeholder="Nome do convidado..." className="w-full glass rounded-2xl py-4 px-6 text-white outline-none"/>
        <button onClick={addGuest} className="absolute right-3 top-2.5 p-2 bg-rose-500 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
        {guests.map(guest => (
          <div key={guest.id} className="group flex items-center justify-between p-4 glass rounded-2xl border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 font-bold">{guest.name[0]}</div>
              <div>
                <p className="font-bold text-slate-200">{guest.name}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`px-1 rounded ${guest.status === 'Confirmado' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>{guest.status}</span>
                  {guest.notified && <span className="text-sky-400 flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Notificado</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleNotify(guest.id)} className={`p-2 rounded-xl ${guest.notified ? 'bg-sky-500 text-white' : 'text-slate-500'}`}><Send className="w-4 h-4" /></button>
              <button onClick={() => removeGuest(guest.id)} className="p-2 text-rose-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestSection;
