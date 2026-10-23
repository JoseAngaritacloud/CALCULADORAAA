import React from 'react';
import { AngleUnit } from '../types/calculator';

interface ScientificKeypadProps {
  onScientificFunc: (func: string) => void;
  onConstant: (constant: string) => void;
  angleMode: AngleUnit;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onScientificFunc,
  onConstant,
  angleMode,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 animate-in fade-in duration-200">
      <button
        type="button"
        onClick={() => onScientificFunc('sin')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title={`Seno (${angleMode})`}
      >
        sin
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('cos')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title={`Coseno (${angleMode})`}
      >
        cos
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('tan')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title={`Tangente (${angleMode})`}
      >
        tan
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('sqrt')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Raíz cuadrada (√x)"
      >
        √x
      </button>

      <button
        type="button"
        onClick={() => onScientificFunc('sqr')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Cuadrado (x²)"
      >
        x²
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('ln')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Logaritmo natural (ln)"
      >
        ln
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('log')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Logaritmo base 10 (log)"
      >
        log
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('inv')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Inverso (1/x)"
      >
        1/x
      </button>

      <button
        type="button"
        onClick={() => onConstant('pi')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-indigo-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Constante Pi (π)"
      >
        π
      </button>
      <button
        type="button"
        onClick={() => onConstant('e')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-indigo-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Constante de Euler (e)"
      >
        e
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('fact')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Factorial (x!)"
      >
        x!
      </button>
      <button
        type="button"
        onClick={() => onScientificFunc('cube')}
        className="p-2.5 rounded-lg text-xs font-mono font-medium bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/30 active:scale-95 transition-all"
        title="Cubo (x³)"
      >
        x³
      </button>
    </div>
  );
};
