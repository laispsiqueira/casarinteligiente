import React, { useState, useRef, useEffect } from 'react';
import { Message, GeneratedAsset } from '../types';
import { gemini } from '../services/gemini';
import { useWedding } from '../context/WeddingContext';
import { Send, Image as ImageIcon, Loader2, X, Globe, Sparkles, Layers } from 'lucide-react';

const ChatSection: React.FC = () => {
  const { messages, addMessage, pendingInspiration, setPendingInspiration, assets } = useWedding();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStudioGallery, setShowStudioGallery] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingInspiration) {
      setSelectedImage(pendingInspiration);
      setPendingInspiration(null); 
    }
  }, [pendingInspiration, setPendingInspiration]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, streamingText]);

  const handleSend = async (textOverride?: string) => {
    const finalInput = textOverride || input;
    if (!finalInput.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput || (selectedImage ? "O que você acha desta inspiração?" : ""),
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    addMessage(userMsg);
    setInput('');
    const tempImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingText('');

    try {
      const { text, sources } = await gemini.chatStream(
        userMsg.content, 
        messages, 
        tempImage || undefined,
        (chunk) => setStreamingText(chunk)
      );
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        sources,
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);
    } catch (error) {
      console.error(error);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sinto muito, tivemos uma breve interrupção técnica.",
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const selectFromStudio = (url: string) => {
    setSelectedImage(url);
    setShowStudioGallery(false);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-12 relative bg-[var(--brand-bg)] transition-colors duration-300">
      <div className="flex-1 overflow-y-auto py-10 space-y-8 no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in">
            <div className="w-24 h-24 bg-[#402005]/40 rounded-[2.5rem] flex items-center justify-center border border-[#ED8932]/30 animate-float shadow-2xl relative">
              <span className="text-4xl">💼</span>
              <div className="absolute -bottom-2 -right-2 bg-[#ED8932] p-1.5 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="max-w-md space-y-4">
              <h2 className="text-4xl font-bold text-[var(--brand-text)] font-serif">Olá, eu sou a Vanessa</h2>
              <p className="text-[var(--brand-text-muted)] text-lg">Sua consultora para um planejamento <b>consciente e seguro</b>.</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Inicie enviando uma pergunta ou uma inspiração</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 bg-[#402005] rounded-xl flex items-center justify-center shrink-0 border border-[#ED8932]/20 mt-1">
                <span className="text-sm font-bold text-[#ED8932] font-serif">V</span>
              </div>
            )}
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-6 py-4 ${
              msg.role === 'user' 
              ? 'bg-[#402005] text-white rounded-tr-none border border-[#ED8932]/20 shadow-xl' 
              : 'glass text-[var(--brand-text)] border-l-4 border-l-[#ED8932]'
            }`}>
              {msg.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={msg.image} alt="Referência" className="max-w-full h-auto object-cover" />
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {msg.sources.map((source, i) => (
                    <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-[#ED8932] hover:bg-[#ED8932]/10 transition-colors">
                      <Globe className="w-3 h-3" /> {source.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 bg-[#402005] rounded-xl flex items-center justify-center shrink-0 border border-[#ED8932]/20 mt-1">
              <span className="text-sm font-bold text-[#ED8932] font-serif">V</span>
            </div>
            <div className="glass max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tl-none px-6 py-4 border-l-4 border-l-[#ED8932] text-[var(--brand-text)] animate-in fade-in">
              <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{streamingText}</div>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 animate-pulse bg-[#402005] rounded-xl flex items-center justify-center shrink-0 border border-[#ED8932]/20">
              <Loader2 className="w-5 h-5 animate-spin text-[#ED8932]" />
            </div>
          </div>
        )}
      </div>

      {showStudioGallery && (
        <div className="absolute inset-x-0 bottom-[140px] px-4 md:px-12 z-30 animate-in slide-in-from-bottom-4">
          <div className="glass border border-[#ED8932]/30 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[var(--brand-text)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ED8932]" /> Suas Criações do Estúdio
              </h3>
              <button onClick={() => setShowStudioGallery(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {assets.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {assets.map((asset) => (
                    <button 
                      key={asset.id} 
                      onClick={() => selectFromStudio(asset.url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#ED8932] transition-all group relative"
                    >
                      <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <p className="text-sm">Nenhuma imagem gerada no Estúdio ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pb-8 pt-4 z-10 bg-[var(--brand-bg)] transition-colors duration-300">
        {selectedImage && (
          <div className="mb-2 relative inline-block animate-in slide-in-from-bottom-2">
            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#ED8932] shadow-2xl">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="relative gradient-border p-1 flex items-end gap-2 shadow-2xl transition-colors">
          <div className="flex items-center">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-3.5 text-slate-500 hover:text-[#ED8932] transition-colors"
              title="Anexar do dispositivo"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setShowStudioGallery(!showStudioGallery)} 
              className={`p-3.5 transition-colors ${showStudioGallery ? 'text-[#ED8932]' : 'text-slate-500 hover:text-[#ED8932]'}`}
              title="Escolher do Estúdio de Design"
            >
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*"/>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={selectedImage ? "O que deseja saber sobre esta inspiração?" : "Como a Vanessa pode te orientar hoje?"}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--brand-text)] placeholder-slate-600 resize-none py-4 px-2 outline-none"
            rows={1}
          />
          
          <button 
            onClick={() => handleSend()} 
            disabled={isLoading || (!input.trim() && !selectedImage)} 
            className={`p-3.5 rounded-xl transition-all ${
              isLoading || (!input.trim() && !selectedImage)
              ? 'bg-slate-800 text-slate-500'
              : 'bg-[#ED8932] text-white shadow-lg shadow-[#ED8932]/20 active:scale-95'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;