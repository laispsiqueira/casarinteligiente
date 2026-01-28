import React, { useState } from 'react';
import { GeneratedAsset } from '../types';
import { gemini } from '../services/gemini';
import { Image as ImageIcon, Sparkles, Download, Loader2, Share2 } from 'lucide-react';

interface ImageSectionProps {
  assets: GeneratedAsset[];
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({ assets, onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const url = await gemini.generateImage(prompt, aspectRatio);
      onAssetGenerated({
        id: Date.now().toString(),
        type: 'image',
        url,
        prompt,
        timestamp: Date.now(),
        aspectRatio
      });
      setPrompt('');
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar imagem. Tente reduzir a complexidade do prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#020617]/50">
      <div className="p-8 md:p-12 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#ED8932]/10 rounded-xl border border-[#ED8932]/20">
                  <ImageIcon className="w-6 h-6 text-[#ED8932]" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-serif">Estúdio de Design</h1>
              </div>
              <p className="text-slate-400 text-sm">Materialize sua visão de decoração e estilo com inteligência artificial.</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Formato</label>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      aspectRatio === ratio 
                      ? 'bg-[#ED8932] text-white shadow-lg shadow-[#ED8932]/20' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ED8932] to-[#402005] rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative glass rounded-3xl p-2 flex flex-col md:flex-row gap-2 border-white/10">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Altar de casamento ao ar livre, estilo boho chic com muitas flores brancas e luzes de fada ao entardecer..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 min-h-[100px] md:min-h-0 py-4 px-6 outline-none text-lg leading-relaxed"
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 ${
                  !prompt.trim() || isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-[#ED8932] text-white hover:bg-[#d97c2a] hover:scale-105 active:scale-95 shadow-xl font-bold'
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Materializar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              Conceitos Gerados
              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 border border-white/5">{assets.length}</span>
            </h2>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative glass rounded-3xl overflow-hidden border border-white/10 hover:border-[#ED8932]/30 transition-all duration-500 break-inside-avoid shadow-2xl">
                <img 
                  src={asset.url} 
                  alt={asset.prompt} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <p className="text-sm text-white line-clamp-3 mb-4 font-medium leading-relaxed">{asset.prompt}</p>
                  <div className="flex gap-2">
                    <a 
                      href={asset.url}
                      download={`casar-inteligente-${asset.id}.png`}
                      className="flex-1 bg-white text-black rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Salvar
                    </a>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 text-white transition-all active:scale-95">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {assets.length === 0 && !isGenerating && (
              <div className="py-32 text-center col-span-full">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                  <ImageIcon className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 font-serif">Nenhuma criação ainda</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">Descreva um conceito acima para começar a materializar suas ideias decorativas.</p>
              </div>
            )}

            {isGenerating && (
              <div className="glass rounded-3xl aspect-[4/5] flex flex-col items-center justify-center gap-6 animate-pulse border-[#ED8932]/20 shadow-2xl shadow-[#ED8932]/5">
                <div className="w-16 h-16 bg-[#ED8932]/10 rounded-full flex items-center justify-center border border-[#ED8932]/20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ED8932]" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-bold text-[#ED8932] uppercase tracking-widest">Processando Visão</p>
                  <p className="text-xs text-slate-500">Vanessa está cuidando dos detalhes...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;