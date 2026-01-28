
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { GroundingSource, AppMode } from '../types';
import { useWedding } from '../context/WeddingContext';
import { Search, MapPin, ExternalLink, Briefcase, Loader2, Star, Globe, Lock } from 'lucide-react';

const SupplierSection: React.FC = () => {
  const { user, setMode } = useWedding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isRestricted = user.role === 'Assessor Free';

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    if (isRestricted) {
      setMode(AppMode.UPGRADE);
      return;
    }

    setIsLoading(true);
    try {
      const data = await gemini.searchSuppliers(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-6 py-10 overflow-hidden relative">
      {isRestricted && (
        <div className="absolute top-0 right-0 p-8 z-10">
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-amber-500 text-xs font-bold flex items-center gap-2">
            <Lock className="w-3 h-3" /> Assessor Free: Funcionalidade Restrita
          </div>
        </div>
      )}

      <div className="space-y-1 mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="text-amber-400" />
          Busca de Fornecedores
        </h1>
        <p className="text-slate-400 text-sm">Encontre fotógrafos, buffets, espaços e muito mais com curadoria inteligente.</p>
      </div>

      <div className="flex gap-2 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: Melhores buffets em São Paulo, Fotógrafos de casamento RJ..."
            className="w-full glass rounded-2xl py-4 pl-12 pr-6 outline-none border-white/5 focus:border-amber-500/30 transition-all text-white"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="px-8 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-amber-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-medium animate-pulse">Pesquisando no mercado para você...</p>
          </div>
        )}

        {!isLoading && results && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass p-8 rounded-3xl border-white/5 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                <Star className="w-3 h-3 fill-current" />
                Sugestões do Assistente
              </h3>
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">{results.text}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.sources.map((source, i) => (
                <a 
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-6 rounded-2xl border-white/5 hover:border-amber-500/20 hover:bg-white/5 transition-all group flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{source.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{source.uri}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !results && (
          <div className="py-20 text-center opacity-30">
            <Search className="w-16 h-16 mx-auto mb-4" />
            <p>Use a barra de busca para encontrar fornecedores qualificados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierSection;
