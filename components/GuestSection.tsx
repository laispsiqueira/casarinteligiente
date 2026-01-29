
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Users, Send, MessageSquare, Plus, Trash2, Smartphone, Sparkles, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../shared/utils/export';

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

  const handleExport = () => {
    const dataToExport = guests.map(g => ({
      Nome: g.name,
      Status: g.status,
      Notificado: g.notified ? 'Sim' : 'Não'
    }));
    exportToCSV(dataToExport, 'Lista_Convidados');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[var(--brand-text)] flex items-center gap-3 transition-colors"><Smartphone className="text-rose-500" /> Gestão de Convidados</h1>
          <p className="text-[var(--brand-text-muted)] text-sm transition-colors">Automação e controle de RSVP.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Exportar Excel
          </button>
          <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-500 font-bold">{guests.length} Convidados</div>
        </div>
      </div>

      <div className="relative mb-8">
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && addGuest()} 
          placeholder="Nome do convidado..." 
          className="w-full glass rounded-2xl py-4 px-6 text-[var(--brand-text)] outline-none placeholder:text-[var(--brand-text-muted)] transition-colors"
        />
        <button onClick={addGuest} className="absolute right-3 top-2.5 p-2 bg-rose-500 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
        {guests.map(guest => (
          <div key={guest.id} className="group flex items-center justify-between p-4 glass rounded-2xl border-[var(--sidebar-border)] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 font-bold shrink-0">{guest.name[0]}</div>
              <div>
                <p className="font-bold text-[var(--brand-text)] transition-colors">{guest.name}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`px-1 rounded font-bold uppercase ${guest.status === 'Confirmado' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>{guest.status}</span>
                  {guest.notified && <span className="text-sky-500 flex items-center gap-1 font-bold uppercase"><MessageSquare className="w-3 h-3"/> Notificado</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleNotify(guest.id)} className={`p-2 rounded-xl transition-all ${guest.notified ? 'bg-sky-500 text-white shadow-lg' : 'text-[var(--brand-text-muted)] hover:text-sky-500'}`} title="Notificar Convidado"><Send className="w-4 h-4" /></button>
              <button onClick={() => removeGuest(guest.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" title="Remover"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {guests.length === 0 && (
          <div className="text-center py-20 opacity-30 text-[var(--brand-text)] transition-colors italic">Sua lista de convidados está vazia.</div>
        )}
      </div>
    </div>
  );
};

export default GuestSection;
