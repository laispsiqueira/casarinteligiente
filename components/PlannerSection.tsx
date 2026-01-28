
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { gemini } from '../services/gemini';
import { CheckCircle2, Circle, Plus, Sparkles, Loader2, Trash2, LayoutList, CheckSquare } from 'lucide-react';

const PlannerSection: React.FC = () => {
  const { tasks, setTasks } = useWedding();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addTask = (title: string, category = 'Geral') => {
    if (!title.trim()) return;
    setTasks(prev => [{ id: Date.now().toString(), title, completed: false, category }, ...prev]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const generateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const suggestedTasks = await gemini.generateTasks("Casamento completo com foco em economia consciente");
      const formatted = suggestedTasks.map((t: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: t.title,
        category: t.category,
        completed: false
      }));
      setTasks(prev => [...formatted, ...prev]);
    } catch (error) { console.error(error); } finally { setIsGenerating(false); }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><LayoutList className="text-emerald-400" /> Meu Planejamento</h1>
          <p className="text-slate-400 text-sm">Decisões salvas localmente no seu dispositivo.</p>
        </div>
        <button onClick={generateAIPlan} disabled={isGenerating} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Sugerir Plano
        </button>
      </div>
      
      <div className="relative mb-8">
        <input 
          type="text" value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && addTask(input)} 
          placeholder="Adicionar tarefa..." 
          className="w-full glass rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/30" 
        />
        <button onClick={() => addTask(input)} className="absolute right-3 top-2.5 p-2 bg-emerald-500 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className={`group flex items-center justify-between p-4 glass rounded-2xl border-white/5 ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTask(task.id)}>{task.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}</button>
              <div>
                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                <span className="text-[10px] uppercase text-emerald-500 font-bold">{task.category}</span>
              </div>
            </div>
            <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerSection;
