
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface Action {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  actions?: Action[];
  customElement?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-[#ED8932]",
  actions = [],
  customElement
}) => {
  const getVariantStyles = (variant: string = 'secondary') => {
    switch (variant) {
      case 'primary': return 'bg-[#ED8932] text-white hover:bg-[#d97c2a] shadow-[#ED8932]/20';
      case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20';
      default: return 'bg-white/5 text-[var(--brand-text)] border-[var(--sidebar-border)] hover:bg-white/10';
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 animate-in fade-in duration-500">
      <div className="space-y-1 w-full md:w-auto">
        <h1 className="text-3xl font-bold text-[var(--brand-text)] font-serif flex items-center gap-3 transition-colors">
          <Icon className={iconColor} /> {title}
        </h1>
        {subtitle && <p className="text-[var(--brand-text-muted)] text-sm transition-colors">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {customElement}
        {actions.map((action, idx) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all border ${getVariantStyles(action.variant)} ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ActionIcon className="w-4 h-4" /> {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
