import React from 'react';
import { History, Trash2, ClipboardList, Info } from 'lucide-react';
import { HistoryItem } from '../types/calculator';
import { formatDisplayNumber } from '../utils/calculator';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  precisionMode: boolean;
  onTogglePrecision: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  precisionMode,
  onTogglePrecision,
}) => {
  return (
    <div className="w-full md:w-80 bg-slate-950/40 p-6 md:p-7 flex flex-col justify-between select-none">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
              Historial
            </h2>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              id="btn-clear-history"
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-slate-800/40"
              title="Borrar historial"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* History List */}
        <div
          id="history-list"
          className="mt-4 space-y-2.5 overflow-y-auto max-h-[380px] pr-1.5 flex-1"
        >
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-600 text-xs flex flex-col items-center gap-2.5">
              <ClipboardList className="w-8 h-8 opacity-40 text-slate-500" strokeWidth={1.5} />
              <span>No hay operaciones recientes</span>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-850/90 cursor-pointer transition-all duration-150 flex flex-col text-right group shadow-sm hover:shadow-indigo-950/30"
                title="Haga clic para reutilizar este resultado"
              >
                <span className="text-xs text-slate-400 font-mono tracking-wide truncate">
                  {formatDisplayNumber(item.previousInput)} {item.operation}{' '}
                  {formatDisplayNumber(item.currentInput)} =
                </span>
                <span className="text-base font-semibold text-indigo-300 font-mono group-hover:text-white transition-colors">
                  {formatDisplayNumber(item.result)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Info Card: Modo Precisión */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 shrink-0">
        <button
          type="button"
          onClick={onTogglePrecision}
          className="w-full p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 flex items-center justify-between transition-colors cursor-pointer group"
          title={
            precisionMode
              ? 'Modo Precisión activo: previene errores de coma flotante (ej. 0.1 + 0.2 = 0.3)'
              : 'Modo estándar activo: coma flotante directa de JavaScript'
          }
        >
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
              Modo Precisión
            </span>
            <Info className="w-3 h-3 text-slate-500 group-hover:text-slate-400" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-all ${
              precisionMode
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                precisionMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            {precisionMode ? 'Activo' : 'Desactivado'}
          </span>
        </button>
      </div>
    </div>
  );
};
