
import React from 'react';
import { Toaster } from 'react-hot-toast';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--app-bg)] text-[var(--brand-text)]">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: '#1a0d02', color: '#fff', border: '1px solid #ED893220' },
          success: { iconTheme: { primary: '#ED8932', secondary: '#fff' } }
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
