import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatDisplayNumber } from '../utils/calculator';

interface DisplayProps {
  currentInput: string;
  subDisplay: string;
}

export const Display: React.FC<DisplayProps> = ({ currentInput, subDisplay }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (currentInput === 'Error') return;
    navigator.clipboard.writeText(currentInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedMain = formatDisplayNumber(currentInput);
  
  // Dynamic font sizing based on length to prevent layout breaks
  const getFontSizeClass = (len: number) => {
    if (len > 16) return 'text-2xl md:text-3xl';
    if (len > 12) return 'text-3xl md:text-4xl';
    if (len > 9) return 'text-4xl md:text-5xl';
    return 'text-4xl md:text-5xl';
  };

  return (
    <div className="my-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 md:p-6 text-right flex flex-col justify-end shadow-inner relative overflow-hidden group min-h-[120px]">
      {/* Sub-display / Current expression */}
      <div 
        id="sub-display" 
        className="text-sm md:text-base font-mono text-slate-400 h-6 truncate tracking-wide transition-all"
      >
        {subDisplay}
      </div>

      {/* Main Display / Current Number or Result */}
      <div className="flex items-baseline justify-end gap-1 overflow-hidden mt-1">
        <span 
          id="main-display" 
          className={`font-mono font-semibold tracking-tight text-white select-all break-all transition-all duration-150 ${getFontSizeClass(formattedMain.length)}`}
        >
          {formattedMain}
        </span>
      </div>

      {/* Copy tooltip feedback */}
      <div 
        id="copy-badge" 
        className={`absolute top-3 left-4 transition-all duration-200 text-xs font-medium px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 ${
          copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <Check className="w-3.5 h-3.5 text-indigo-400" />
        <span>Copiado al portapapeles</span>
      </div>

      {/* Copy button */}
      <button 
        id="btn-copy" 
        onClick={handleCopy}
        className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 focus:opacity-100 focus:outline-none" 
        title="Copiar resultado"
        aria-label="Copiar resultado al portapapeles"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
};
