
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { gemini } from '../services/gemini';
import { PageHeader } from '../shared/components/PageHeader';
import toast from 'react-hot-toast';
import { CheckCircle2, Circle, Plus, Sparkles, Loader2, Trash2, LayoutList, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../shared/utils/export';

const PlannerSection: React.FC = () => {
  const { tasks, setTasks } = useWedding();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addTask = (title: string) => {
    if (!title.trim()) return;
    setTasks(prev => [{ id: Date.now().toString(), title, category: 'Geral', completed: false }, ...prev]);
    setInput('');
    toast.success('Tarefa adicionada!');
  };

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const generateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const suggested = await gemini.extractTasks([]); // Pode usar histórico se quiser
      const formatted = suggested.map((t: any) => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false }));
      setTasks(prev => [...formatted, ...prev]);
      toast.success('Sugestões adicionadas!');
    } catch (error) { toast.error('Erro ao gerar plano.'); } finally { setIsGenerating(false); }
  };

  const headerActions = [
    { label: 'Excel', icon: FileSpreadsheet, onClick: () => exportToCSV(tasks, 'Planejamento'), variant: 'success' as const },
    { label: isGenerating ? 'Processando' : 'Sugerir', icon: isGenerating ? Loader2 : Sparkles, onClick: generateAIPlan, variant: 'warning' as const, disabled: isGenerating }
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <PageHeader 
        title="Meu Planejamento" 
        subtitle="Organize cada detalhe com segurança." 
        icon={LayoutList} 
        iconColor="text-emerald-500"
        actions={headerActions}
      />
      
      <div className="relative mb-8">
        <input 
          type="text" value={input} onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && addTask(input)} 
          placeholder="Ex: Contratar fotógrafo..." 
          className="w-full glass rounded-2xl py-4 px-6 text-[var(--brand-text)] outline-none focus:border-emerald-500/30 transition-all" 
        />
        <button onClick={() => addTask(input)} className="absolute right-3 top-2.5 p-2 bg-emerald-500 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-10">
        {tasks.map(task => (
          <div key={task.id} className={`group flex items-center justify-between p-4 glass rounded-2xl border-[var(--sidebar-border)] transition-all ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTask(task.id)}>
                {task.completed ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Circle className="text-[var(--brand-text-muted)] w-6 h-6" />}
              </button>
              <div>
                <p className={`font-medium ${task.completed ? 'line-through text-[var(--brand-text-muted)]' : 'text-[var(--brand-text)]'}`}>{task.title}</p>
                <span className="text-[10px] uppercase text-emerald-500 font-bold">Categoria: {task.category}</span>
              </div>
            </div>
            <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerSection;
