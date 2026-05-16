'use client';

interface StepIndicatorProps {
  title: string;
  active: boolean;
  completed?: boolean;
}

export function StepIndicator({ title, active, completed = false }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
      active ? 'bg-white/20 opacity-100 scale-105' : completed ? 'opacity-60' : 'opacity-40'
    }`}>
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
          active 
            ? 'bg-white text-green-600 shadow-lg' 
            : completed
            ? 'bg-green-400 text-white'
            : 'bg-green-500/40 text-white'
        }`}
      >
        {completed ? '✓' : '●'}
      </div>
      <span className={`font-semibold ${active ? 'text-white' : 'text-green-100'}`}>{title}</span>
    </div>
  );
}
