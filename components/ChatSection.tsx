import React, { useState, useRef, useEffect } from 'react';
import { Message, GroundingSource } from '../types';
import { gemini } from '../services/gemini';
import { Send, Image as ImageIcon, Loader2, User, Bot, X, ExternalLink, MapPin, Globe, Sparkles } from 'lucide-react';

interface ChatSectionProps {
  messages: Message[];
  onSendMessage: (msg: Message) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

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

    onSendMessage(userMsg);
    setInput('');
    const tempImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const { text, sources } = await gemini.chat(userMsg.content, tempImage || undefined);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        sources,
        timestamp: Date.now(),
      };
      onSendMessage(assistantMsg);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sinto muito, tivemos uma breve interrupção técnica. Como sua consultora, estou aqui para retomar nossa conversa com a calma e clareza que seu planejamento merece.",
        timestamp: Date.now(),
      };
      onSendMessage(errorMsg);
    } finally {
      setIsLoading(false);
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

  const suggestions = [
    "Como ter clareza antes de gastar?",
    "Quero um roteiro de tarefas consciente",
    "Busca de fornecedores com critério",
    "Dúvidas sobre o método Casar Inteligente"
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-12 relative">
      <div className="flex-1 overflow-y-auto py-10 space-y-8 no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="w-24 h-24 bg-[#402005]/40 rounded-[2.5rem] flex items-center justify-center border border-[#ED8932]/30 animate-float shadow-2xl shadow-[#ED8932]/10 relative">
              <span className="text-4xl">💼</span>
              <div className="absolute -bottom-2 -right-2 bg-[#ED8932] p-1.5 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="max-w-md space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight font-serif">Olá, eu sou a Vanessa</h2>
              <p className="text-slate-400 text-lg leading-relaxed">Consultora da Casar Inteligente. Estou aqui para oferecer <b>clareza, critério e segurança</b> para que você não precise errar no seu planejamento.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="p-4 text-left glass rounded-2xl text-slate-300 hover:text-white hover:bg-[#402005]/40 transition-all border-white/5 hover:border-[#ED8932]/30 text-sm group"
                >
                  <span className="flex items-center justify-between">
                    {s}
                    <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#ED8932]" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 bg-[#402005] rounded-xl flex items-center justify-center shrink-0 border border-[#ED8932]/20 mt-1 shadow-lg">
                <span className="text-sm font-bold text-[#ED8932] font-serif">V</span>
              </div>
            )}
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-6 py-4 ${
              msg.role === 'user' 
              ? 'bg-[#402005] text-white shadow-xl shadow-black/20 rounded-tr-none border border-[#ED8932]/20' 
              : 'glass text-slate-200 border-white/5 rounded-tl-none border-l-4 border-l-[#ED8932]'
            }`}>
              {msg.image && (
                <div className="relative mb-4 group cursor-pointer overflow-hidden rounded-xl">
                  <img src={msg.image} alt="Upload" className="max-w-full max-h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {msg.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#ED8932] hover:bg-[#ED8932]/10 transition-colors"
                    >
                      {source.uri?.includes('google.com/maps') ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      <span className="max-w-[120px] truncate font-medium">{source.title || 'Referência'}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                    </a>
                  ))}
                </div>
              )}

              <div className="text-[10px] mt-3 opacity-30 font-bold uppercase tracking-widest flex items-center gap-2">
                <span>Vanessa</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 mt-1">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 bg-[#402005] rounded-xl flex items-center justify-center shrink-0 border border-[#ED8932]/20">
              <span className="text-sm font-bold text-[#ED8932] font-serif">V</span>
            </div>
            <div className="glass rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-3 border-white/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#ED8932] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[#ED8932] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#ED8932] rounded-full animate-bounce"></div>
              </div>
              <span className="text-slate-500 text-sm font-medium italic">Vanessa está estruturando a resposta...</span>
            </div>
          </div>
        )}
      </div>

      <div className="pb-8 pt-4 z-10 bg-gradient-to-t from-[#1a0d02] via-[#1a0d02] to-transparent">
        <div className="relative gradient-border p-1 flex items-end gap-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-[#ED8932]/20">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 text-slate-500 hover:text-[#ED8932] hover:bg-white/5 rounded-xl transition-all"
            title="Anexar referência visual"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            className="hidden" 
            accept="image/*"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Como a Casar Inteligente pode te orientar hoje?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 resize-none max-h-40 py-4 px-2 outline-none text-[15px]"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`p-3.5 rounded-xl transition-all ${
              (!input.trim() && !selectedImage) || isLoading 
              ? 'text-slate-800' 
              : 'text-white bg-[#ED8932] hover:bg-[#d97c2a] shadow-lg shadow-[#ED8932]/10 hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-600 mt-3 font-bold tracking-[0.2em] uppercase">Simplicidade • Segurança • Consciência</p>
      </div>
    </div>
  );
};

export default ChatSection;