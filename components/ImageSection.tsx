
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { gemini } from '../services/gemini';
import { AppMode } from '../types';
import { Image as ImageIcon, Sparkles, Download, Loader2, MessageSquarePlus } from 'lucide-react';

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
      // Pequeno timeout para garantir que o estado do UI atualizou antes da chamada pesada
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const url = await gemini.generateImage(prompt, aspectRatio);
      addAsset({ 
        id: Date.now().toString(), 
        type: 'image', 
        url, 
        prompt, 
        timestamp: Date.now(), 
        aspectRatio 
      });
      setPrompt('');
    } catch (error) { 
      console.error("Erro na geração:", error);
      alert("Houve um problema na geração. Verifique sua conexão ou tente um prompt diferente."); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleSendToChat = (url: string) => {
    setPendingInspiration(url);
    setMode(AppMode.CHAT);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-2">
                <ImageIcon className="text-[#ED8932]"/> Estúdio de Design
              </h1>
              <p className="text-slate-400 text-sm">Sua visão materializada pela Vanessa.</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {(["1:1", "16:9", "9:16"] as const).map(ratio => (
                <button 
                  key={ratio} 
                  type="button"
                  onClick={() => setAspectRatio(ratio)} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    aspectRatio === ratio ? 'bg-[#ED8932] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="glass rounded-2xl p-2 flex gap-2 shadow-2xl border border-[#ED8932]/10">
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Descreva sua inspiração para o altar, bouquet ou decoração..." 
              className="flex-1 bg-transparent border-none text-white outline-none p-4 h-24 resize-none placeholder-slate-600 text-sm focus:ring-0"
              disabled={isGenerating}
            />
            <button 
              type="submit"
              disabled={isGenerating || !prompt.trim()} 
              className={`px-8 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[120px] ${
                isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-[#ED8932] text-white hover:bg-[#d97c2a] shadow-lg shadow-[#ED8932]/20 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5"/>
                  <span className="text-[10px]">Criando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5"/>
                  <span className="text-xs">Gerar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {assets.map(asset => (
            <div key={asset.id} className="group relative glass rounded-3xl overflow-hidden border border-white/10 break-inside-avoid hover:border-[#ED8932]/40 transition-all duration-500 shadow-lg">
              <img src={asset.url} alt={asset.prompt} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <p className="text-xs text-white/80 mb-4 line-clamp-3 font-medium italic leading-relaxed">"{asset.prompt}"</p>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => handleSendToChat(asset.url)}
                    className="flex-1 bg-[#ED8932] text-white py-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#d97c2a] transition-colors shadow-lg"
                  >
                    <MessageSquarePlus className="w-4 h-4" /> Consultar Vanessa
                  </button>
                  <a 
                    href={asset.url} 
                    download={`casar-inteligente-${asset.id}.png`}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl flex items-center justify-center transition-colors border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
          {assets.length === 0 && !isGenerating && (
            <div className="col-span-full py-32 text-center opacity-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-serif mb-2">Seu mural de inspirações está vazio</h3>
              <p className="text-sm">Descreva um conceito acima para começar a materializar seu sonho.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
