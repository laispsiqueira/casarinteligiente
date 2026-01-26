
import React, { useState } from 'react';
import { GeneratedAsset } from '../types';
import { gemini } from '../services/gemini';
import { Play, Film, Download, Loader2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

interface VideoSectionProps {
  assets: GeneratedAsset[];
  onAssetGenerated: (asset: GeneratedAsset) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ assets, onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus('Conectando ao Veo Studio...');
    
    try {
      const videoUrl = await gemini.generateVideo(prompt, (msg) => setStatus(msg));
      onAssetGenerated({
        id: Date.now().toString(),
        type: 'video',
        url: videoUrl,
        prompt,
        timestamp: Date.now()
      });
      setPrompt('');
    } catch (error: any) {
      console.error(error);
      alert("A geração de vídeo falhou. Verifique se você tem uma chave de API paga do Google Cloud vinculada.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#020617]">
      <div className="p-8 md:p-12 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Film className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Laboratório de Motion</h1>
            </div>
            <p className="text-slate-400 text-sm">Transforme conceitos em experiências cinematográficas com Veo 3.1.</p>
          </div>

          <div className="glass p-5 rounded-2xl border-indigo-500/20 bg-indigo-500/[0.03] flex gap-4 items-center">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-sm text-indigo-200/60 leading-relaxed font-medium">
              A geração de vídeo requer alto processamento e pode levar até 3 minutos. Mantenha esta aba aberta durante o processo.
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva a movimentação cinematográfica... (Ex: Um drone percorrendo um jardim tecnológico futurista em câmera lenta)"
              className="w-full glass rounded-3xl p-8 pr-48 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[160px] resize-none border-white/10 text-xl leading-relaxed placeholder-slate-600"
            />
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`absolute bottom-6 right-6 flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-2xl font-bold tracking-wide ${
                !prompt.trim() || isGenerating 
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Gerar Filme</span>
                </>
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="flex flex-col items-center gap-4 py-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-full max-w-xl h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 animate-[progress_3s_infinite_linear]" style={{ width: '60%' }}></div>
              </div>
              <p className="text-indigo-400 font-bold text-sm flex items-center gap-3 uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin" />
                {status}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              Produções Recentes
              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 border border-white/5">{assets.length}</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {assets.map((asset) => (
              <div key={asset.id} className="group glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:border-indigo-500/20 transition-all duration-500">
                <div className="aspect-video relative bg-slate-950">
                  <video 
                    src={asset.url} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                <div className="p-8 flex items-start justify-between gap-6 bg-gradient-to-b from-transparent to-white/[0.02]">
                  <div className="flex-1 space-y-3">
                    <p className="text-slate-200 text-base leading-relaxed font-medium line-clamp-2 italic">"{asset.prompt}"</p>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg">1080p Cinematic</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(asset.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <a 
                    href={asset.url} 
                    download={`casar-video-${asset.id}.mp4`}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-300 hover:text-white border border-white/10 group-hover:scale-110 active:scale-90"
                    title="Baixar MP4"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                </div>
              </div>
            ))}
            
            {assets.length === 0 && !isGenerating && (
              <div className="col-span-full py-40 text-center">
                <div className="w-24 h-24 mx-auto mb-8 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner">
                  <Film className="w-12 h-12 text-slate-800" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300">Nenhum filme produzido</h3>
                <p className="text-slate-500 mt-3 max-w-sm mx-auto text-lg leading-relaxed">Sua jornada de motion começa aqui. Descreva um cenário dinâmico para ver a mágica acontecer.</p>
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="mt-8 text-indigo-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-indigo-300 transition-colors"
                >
                  Começar Produção <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VideoSection;
