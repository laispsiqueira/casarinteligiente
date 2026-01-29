
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { gemini } from '../services/gemini';
import { AppMode } from '../types';
import { PageHeader } from '../shared/components/PageHeader';
import { Image as ImageIcon, Sparkles, Download, Loader2, MessageSquarePlus, HelpCircle } from 'lucide-react';

const ImageSection: React.FC = () => {
  const { assets, addAsset, setPendingInspiration, setMode } = useWedding();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await gemini.generateImage(prompt, aspectRatio);
      addAsset({ 
        id: Date.now().toString(), type: 'image', url, prompt, timestamp: Date.now(), aspectRatio 
      });
      setPrompt('');
    } catch (error) { 
      alert("Houve um problema na geração."); 
    } finally { setIsGenerating(false); }
  };

  const ratioSelector = (
    <div className="flex bg-white/5 p-1 rounded-xl border border-[var(--sidebar-border)]">
      {(["1:1", "16:9", "9:16"] as const).map(ratio => (
        <button 
          key={ratio} onClick={() => setAspectRatio(ratio)} 
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${aspectRatio === ratio ? 'bg-[#ED8932] text-white shadow-lg' : 'text-[var(--brand-text-muted)] hover:text-[var(--brand-text)]'}`}
        >
          {ratio}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader 
            title="Descreva o seu sonho" 
            subtitle="Queremos entender o que tem em mente para o seu dia:"
            icon={ImageIcon}
            customElement={ratioSelector}
          />

          <div className="glass p-5 rounded-2xl border-[var(--sidebar-border)] text-sm space-y-3">
            <div className="flex items-center gap-2 text-[#ED8932] font-bold text-xs uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" /> Guia de Inspiração:
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[var(--brand-text-muted)] text-[11px] leading-relaxed">
              <li className="flex gap-2"><span className="text-[#ED8932]">01.</span> Conte sobre seu estilo e personalidade.</li>
              <li className="flex gap-2"><span className="text-[#ED8932]">02.</span> Descreva o tipo de cerimônia (clássica, moderna, pé na areia).</li>
              <li className="flex gap-2"><span className="text-[#ED8932]">03.</span> Fale sobre as cores e sensações desejadas.</li>
            </ul>
          </div>

          <form onSubmit={handleGenerate} className="glass rounded-2xl p-1.5 flex gap-2 shadow-2xl border border-[#ED8932]/10">
            <input 
              type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Descreva aqui o conceito que imaginou..." 
              className="flex-1 bg-transparent border-none text-[var(--brand-text)] outline-none px-4 py-3 text-sm focus:ring-0"
              disabled={isGenerating}
            />
            <button 
              type="submit" disabled={isGenerating || !prompt.trim()} 
              className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-slate-800 text-slate-500' : 'bg-[#ED8932] text-white shadow-lg'}`}
            >
              {isGenerating ? <Loader2 className="animate-spin w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
              <span className="text-xs">{isGenerating ? 'Criando...' : 'Gerar'}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {assets.map(asset => (
            <div key={asset.id} className="group relative glass rounded-3xl overflow-hidden border border-[var(--sidebar-border)] break-inside-avoid hover:border-[#ED8932]/40 transition-all shadow-lg">
              <img src={asset.url} alt={asset.prompt} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <p className="text-xs text-white/80 mb-4 line-clamp-2 italic">"{asset.prompt}"</p>
                <div className="flex gap-2">
                  <button onClick={() => { setPendingInspiration(asset.url); setMode(AppMode.CHAT); }} className="flex-1 bg-[#ED8932] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <MessageSquarePlus className="w-4 h-4" /> Vanessa
                  </button>
                  <a href={asset.url} download className="bg-white/10 text-white p-2.5 rounded-xl"><Download className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
