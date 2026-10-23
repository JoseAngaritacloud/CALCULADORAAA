import React from 'react';
import { Delete } from 'lucide-react';
import { CalcOperation } from '../types/calculator';

interface KeypadProps {
  onNumber: (num: string) => void;
  onOperation: (op: CalcOperation) => void;
  onClear: () => void;
  onBackspace: () => void;
  onDecimal: () => void;
  onNegate: () => void;
  onPercent: () => void;
  onCalculate: () => void;
  activeKey: string | null;
  activeOp: CalcOperation;
}

export const Keypad: React.FC<KeypadProps> = ({
  onNumber,
  onOperation,
  onClear,
  onBackspace,
  onDecimal,
  onNegate,
  onPercent,
  onCalculate,
  activeKey,
  activeOp,
}) => {
  const isKeyActive = (key: string) => activeKey === key;

  return (
    <div className="grid grid-cols-4 gap-2.5 md:gap-3 mt-3 select-none">
      {/* Row 1: Function Keys */}
      <button
        type="button"
        data-action="clear"
        onClick={onClear}
        className={`p-3.5 md:p-4 rounded-xl text-sm md:text-base font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer flex items-center justify-center ${
          isKeyActive('Escape') || isKeyActive('c') || isKeyActive('C')
            ? 'scale-95 ring-2 ring-rose-400/50 bg-rose-500/30'
            : ''
        }`}
      >
        AC
      </button>

      <button
        type="button"
        data-action="backspace"
        onClick={onBackspace}
        className={`p-3.5 md:p-4 rounded-xl text-sm md:text-base font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-slate-700/60 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center cursor-pointer ${
          isKeyActive('Backspace') ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/80' : ''
        }`}
        title="Retroceso"
        aria-label="Borrar último dígito"
      >
        <Delete className="w-5 h-5" />
      </button>

      <button
        type="button"
        data-action="percent"
        onClick={onPercent}
        className={`p-3.5 md:p-4 rounded-xl text-sm md:text-base font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-slate-700/60 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          isKeyActive('%') ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/80' : ''
        }`}
      >
        %
      </button>

      <button
        type="button"
        data-op="÷"
        onClick={() => onOperation('÷')}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium text-white border transition-all duration-100 active:scale-95 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          activeOp === '÷' || isKeyActive('/')
            ? 'bg-indigo-500 border-indigo-300 shadow-indigo-500/50 scale-95 ring-2 ring-indigo-400'
            : 'bg-indigo-600/80 border-indigo-500/50 hover:bg-indigo-500 shadow-indigo-500/30'
        }`}
      >
        ÷
      </button>

      {/* Row 2: 7, 8, 9, × */}
      {['7', '8', '9'].map((num) => (
        <button
          key={num}
          type="button"
          data-num={num}
          onClick={() => onNumber(num)}
          className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
            isKeyActive(num) ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/70' : ''
          }`}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        data-op="×"
        onClick={() => onOperation('×')}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium text-white border transition-all duration-100 active:scale-95 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          activeOp === '×' || isKeyActive('*')
            ? 'bg-indigo-500 border-indigo-300 shadow-indigo-500/50 scale-95 ring-2 ring-indigo-400'
            : 'bg-indigo-600/80 border-indigo-500/50 hover:bg-indigo-500 shadow-indigo-500/30'
        }`}
      >
        ×
      </button>

      {/* Row 3: 4, 5, 6, - */}
      {['4', '5', '6'].map((num) => (
        <button
          key={num}
          type="button"
          data-num={num}
          onClick={() => onNumber(num)}
          className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
            isKeyActive(num) ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/70' : ''
          }`}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        data-op="-"
        onClick={() => onOperation('-')}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium text-white border transition-all duration-100 active:scale-95 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          activeOp === '-' || isKeyActive('-')
            ? 'bg-indigo-500 border-indigo-300 shadow-indigo-500/50 scale-95 ring-2 ring-indigo-400'
            : 'bg-indigo-600/80 border-indigo-500/50 hover:bg-indigo-500 shadow-indigo-500/30'
        }`}
      >
        −
      </button>

      {/* Row 4: 1, 2, 3, + */}
      {['1', '2', '3'].map((num) => (
        <button
          key={num}
          type="button"
          data-num={num}
          onClick={() => onNumber(num)}
          className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
            isKeyActive(num) ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/70' : ''
          }`}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        data-op="+"
        onClick={() => onOperation('+')}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium text-white border transition-all duration-100 active:scale-95 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          activeOp === '+' || isKeyActive('+')
            ? 'bg-indigo-500 border-indigo-300 shadow-indigo-500/50 scale-95 ring-2 ring-indigo-400'
            : 'bg-indigo-600/80 border-indigo-500/50 hover:bg-indigo-500 shadow-indigo-500/30'
        }`}
      >
        +
      </button>

      {/* Row 5: ±, 0, ., = */}
      <button
        type="button"
        data-action="negate"
        onClick={onNegate}
        className="p-3.5 md:p-4 rounded-xl text-sm md:text-base font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer"
        title="Cambiar signo"
      >
        ±
      </button>

      <button
        type="button"
        data-num="0"
        onClick={() => onNumber('0')}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          isKeyActive('0') ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/70' : ''
        }`}
      >
        0
      </button>

      <button
        type="button"
        data-action="decimal"
        onClick={onDecimal}
        className={`p-3.5 md:p-4 rounded-xl text-lg md:text-xl font-medium bg-slate-800/50 text-slate-100 border border-slate-700/40 hover:bg-slate-700/50 active:scale-95 transition-all duration-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer ${
          isKeyActive('.') || isKeyActive(',') ? 'scale-95 ring-2 ring-slate-400/50 bg-slate-700/70' : ''
        }`}
      >
        .
      </button>

      <button
        type="button"
        data-action="calculate"
        onClick={onCalculate}
        className={`p-3.5 md:p-4 rounded-xl text-xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500 active:scale-95 transition-all duration-100 shadow-[0_0_25px_rgba(99,102,241,0.45)] border border-indigo-400/50 cursor-pointer ${
          isKeyActive('Enter') || isKeyActive('=') ? 'scale-95 ring-2 ring-indigo-300 from-indigo-400 to-indigo-500' : ''
        }`}
      >
        =
      </button>
    </div>
  );
};
