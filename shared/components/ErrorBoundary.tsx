
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center glass rounded-3xl m-4">
          <h2 className="text-2xl font-serif text-white mb-4">Algo deu errado</h2>
          <p className="text-slate-400 mb-6">Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#ED8932] text-white rounded-xl font-bold shadow-lg"
          >
            Recarregar
          </button>
          <details className="mt-8 text-left text-xs opacity-50 max-w-md overflow-auto">
            <summary>Detalhes técnicos</summary>
            <pre className="mt-2 whitespace-pre-wrap">{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
