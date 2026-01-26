
import React, { useState } from 'react';
import { Task } from '../types';
import { gemini } from '../services/gemini';
// Added CheckSquare to imports
import { CheckCircle2, Circle, Plus, Sparkles, Loader2, Trash2, LayoutList, CheckSquare } from 'lucide-react';

const PlannerSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addTask = (title: string, category = 'Geral') => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      category
    };
    setTasks(prev => [newTask, ...prev]);
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
      const suggestedTasks = await gemini.generateTasks("Casamento completo em 12 meses");
      const formatted = suggestedTasks.map((t: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: t.title,
        category: t.category,
        completed: false
      }));
      setTasks(prev => [...formatted, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-10 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutList className="text-emerald-400" />
            Meu Planejamento
          </h1>
          <p className="text-slate-400 text-sm">Organize cada detalhe do seu grande dia.</p>
        </div>
        <button 
          onClick={generateAIPlan}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-semibold disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Sugerir Plano com IA
        </button>
      </div>

      <div className="relative mb-8">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask(input)}
          placeholder="Adicionar nova tarefa..."
          className="w-full glass rounded-2xl py-4 px-6 outline-none border-white/5 focus:border-emerald-500/30 transition-all text-white"
        />
        <button 
          onClick={() => addTask(input)}
          className="absolute right-3 top-2.5 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-2">
        {tasks.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
            <CheckSquare className="w-10 h-10 mb-4 opacity-20" />
            <p>Sua lista está vazia. Comece adicionando ou gerando tarefas.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-4 glass rounded-2xl border-white/5 transition-all hover:bg-white/5 ${task.completed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <button onClick={() => toggleTask(task.id)} className="transition-transform active:scale-90">
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 group-hover:text-emerald-400" />
                  )}
                </button>
                <div>
                  <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-bold">{task.category}</span>
                </div>
              </div>
              <button 
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlannerSection;
