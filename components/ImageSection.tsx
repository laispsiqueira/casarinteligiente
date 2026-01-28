
import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { gemini } from '../services/gemini';
import { Image as ImageIcon, Sparkles, Download, Loader2, Share2 } from 'lucide-react';

const ImageSection: React.FC = () => {
  const { assets, addAsset } = useWedding();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const url = await gemini.generateImage(prompt, aspectRatio);
      addAsset({ id: Date.now().toString(), type: 'image', url, prompt, timestamp: Date.now(), aspectRatio });
      setPrompt('');
    } catch (error) { alert("Erro na geração. Tente um prompt mais simples."); } finally { setIsGenerating(false); }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-2"><ImageIcon className="text-[#ED8932]"/> Estúdio de Design</h1>
              <p className="text-slate-400 text-sm">Sua visão materializada pela Vanessa.</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl">
              {(["1:1", "16:9", "9:16"] as const).map(ratio => (
                <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`px-4 py-1 rounded-lg text-xs font-bold ${aspectRatio === ratio ? 'bg-[#ED8932]' : 'text-slate-500'}`}>{ratio}</button>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-2 flex gap-2">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descreva sua inspiração..." className="flex-1 bg-transparent border-none text-white outline-none p-4 h-24 resize-none"/>
            <button onClick={handleGenerate} disabled={isGenerating} className="bg-[#ED8932] px-6 rounded-xl font-bold flex items-center gap-2">
              {isGenerating ? <Loader2 className="animate-spin"/> : <Sparkles/>} Gerar
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {assets.map(asset => (
            <div key={asset.id} className="group relative glass rounded-3xl overflow-hidden border border-white/10 break-inside-avoid">
              <img src={asset.url} alt={asset.prompt} className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-xs text-white mb-4 line-clamp-2">{asset.prompt}</p>
                <a href={asset.url} download className="bg-white text-black py-2 rounded-lg text-center text-xs font-bold">Download</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
