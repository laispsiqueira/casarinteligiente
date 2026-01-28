
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { gemini } from '../services/gemini';
import { useWedding } from '../context/WeddingContext';
import { Send, Image as ImageIcon, Loader2, User, X, ExternalLink, MapPin, Globe, Sparkles } from 'lucide-react';

const ChatSection: React.FC = () => {
  const { messages, addMessage } = useWedding();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      content: finalInput,
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
      // Arquiteto: Usando URL de objeto para performance em vez de Base64 longo no state se possível
      // Mas para a API do Gemini ainda precisamos do base64 no envio.
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-12 relative">
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
              <h2 className="text-4xl font-bold text-white font-serif">Olá, eu sou a Vanessa</h2>
              <p className="text-slate-400 text-lg">Pronta para oferecer <b>clareza e segurança</b> no seu planejamento.</p>
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
              : 'glass text-slate-200 border-l-4 border-l-[#ED8932]'
            }`}>
              {msg.image && <img src={msg.image} alt="Ref" className="max-w-full max-h-80 object-cover rounded-xl mb-4" />}
              <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {msg.sources.map((source, i) => (
                    <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-[#ED8932]">
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
            <div className="glass max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tl-none px-6 py-4 border-l-4 border-l-[#ED8932] text-slate-200 animate-in fade-in">
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

      <div className="pb-8 pt-4 z-10 bg-[#1a0d02]">
        <div className="relative gradient-border p-1 flex items-end gap-2 shadow-2xl">
          <button onClick={() => fileInputRef.current?.click()} className="p-3.5 text-slate-500 hover:text-[#ED8932]"><ImageIcon className="w-6 h-6" /></button>
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*"/>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Como a Vanessa pode te orientar hoje?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 resize-none py-4 px-2 outline-none"
            rows={1}
          />
          <button onClick={() => handleSend()} disabled={isLoading} className="p-3.5 text-white bg-[#ED8932] rounded-xl"><Send className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
