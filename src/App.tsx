/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, X } from 'lucide-react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { HistoryPanel } from './components/HistoryPanel';
import { HistoryItem, CalcOperation, AngleUnit, CalculatorMode } from './types/calculator';
import { soundController } from './utils/audio';
import {
  formatDisplayNumber,
  executeOperation,
  executeScientificFunction,
  cleanPrecision,
} from './utils/calculator';

export default function App() {
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousInput, setPreviousInput] = useState<string>('');
  const [operation, setOperation] = useState<CalcOperation>(null);
  const [shouldResetScreen, setShouldResetScreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [angleMode, setAngleMode] = useState<AngleUnit>('DEG');
  const [calcMode, setCalcMode] = useState<CalculatorMode>('standard');
  const [precisionMode, setPrecisionMode] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Listo');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calc_history', JSON.stringify(history));
    } catch {
      // ignore storage quota errors
    }
  }, [history]);

  // Audio preference toggle
  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundController.enabled = next;
    if (next) soundController.playDigit();
  };

  // Switch DEG / RAD
  const toggleAngleMode = () => {
    const nextMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    setAngleMode(nextMode);
    soundController.playOperator();
  };

  // Switch Standard / Scientific mode
  const toggleCalcMode = () => {
    const next = calcMode === 'standard' ? 'scientific' : 'standard';
    setCalcMode(next);
    soundController.playOperator();
  };

  // Trigger brief visual key feedback
  const triggerKeyHighlight = useCallback((key: string) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
  }, []);

  // Number input
  const handleNumber = useCallback(
    (num: string) => {
      soundController.playDigit();
      triggerKeyHighlight(num);
      setStatusText(`Dígito ${num}`);

      setCurrentInput((prev) => {
        if (prev === '0' || prev === 'Error' || shouldResetScreen) {
          setShouldResetScreen(false);
          return num;
        }
        // Limit max digits
        const rawDigits = prev.replace(/[^0-9]/g, '');
        if (rawDigits.length >= 14) return prev;
        return prev + num;
      });
    },
    [shouldResetScreen, triggerKeyHighlight]
  );

  // Decimal point
  const handleDecimal = useCallback(() => {
    soundController.playDigit();
    triggerKeyHighlight('.');
    setStatusText('Decimal');

    setCurrentInput((prev) => {
      if (shouldResetScreen || prev === 'Error') {
        setShouldResetScreen(false);
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
  }, [shouldResetScreen, triggerKeyHighlight]);

  // Binary operation (+, -, *, /)
  const handleOperation = useCallback(
    (op: CalcOperation) => {
      soundController.playOperator();
      triggerKeyHighlight(op || '');
      setStatusText(`Operación ${op}`);

      if (currentInput === 'Error') return;

      if (operation !== null && !shouldResetScreen) {
        // Chained calculation
        const outcome = executeOperation(previousInput, operation, currentInput);
        if (!outcome.success) {
          setCurrentInput('Error');
          setPreviousInput('');
          setOperation(null);
          setShouldResetScreen(true);
          return;
        }
        const formattedRes = precisionMode
          ? cleanPrecision(parseFloat(outcome.resultStr), 10).toString()
          : outcome.resultStr;

        setPreviousInput(formattedRes);
        setCurrentInput(formattedRes);
      } else {
        setPreviousInput(currentInput);
      }

      setOperation(op);
      setShouldResetScreen(true);
    },
    [currentInput, operation, previousInput, precisionMode, shouldResetScreen, triggerKeyHighlight]
  );

  // Calculate (=)
  const handleCalculate = useCallback(() => {
    if (operation === null || shouldResetScreen || currentInput === 'Error') {
      soundController.playEquals();
      triggerKeyHighlight('Enter');
      return;
    }

    soundController.playEquals();
    triggerKeyHighlight('Enter');
    setStatusText('Calculado');

    const outcome = executeOperation(previousInput, operation, currentInput);

    if (!outcome.success) {
      setCurrentInput('Error');
      setPreviousInput('');
      setOperation(null);
      setShouldResetScreen(true);
      return;
    }

    const finalResultStr = precisionMode
      ? cleanPrecision(parseFloat(outcome.resultStr), 10).toString()
      : outcome.resultStr;

    // Add to history
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      previousInput,
      operation,
      currentInput,
      result: finalResultStr,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]);
    setCurrentInput(finalResultStr);
    setPreviousInput('');
    setOperation(null);
    setShouldResetScreen(true);
  }, [currentInput, operation, previousInput, precisionMode, shouldResetScreen, triggerKeyHighlight]);

  // All Clear (AC)
  const handleClear = useCallback(() => {
    soundController.playClear();
    triggerKeyHighlight('Escape');
    setCurrentInput('0');
    setPreviousInput('');
    setOperation(null);
    setShouldResetScreen(false);
    setStatusText('Listo');
  }, [triggerKeyHighlight]);

  // Backspace
  const handleBackspace = useCallback(() => {
    soundController.playClear();
    triggerKeyHighlight('Backspace');
    setStatusText('Borrado');

    if (shouldResetScreen || currentInput === 'Error') return;

    setCurrentInput((prev) => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [currentInput, shouldResetScreen, triggerKeyHighlight]);

  // Negate sign (±)
  const handleNegate = useCallback(() => {
    soundController.playDigit();
    if (currentInput === '0' || currentInput === 'Error') return;
    setCurrentInput((prev) => {
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      return '-' + prev;
    });
  }, [currentInput]);

  // Percentage (%)
  const handlePercent = useCallback(() => {
    soundController.playDigit();
    triggerKeyHighlight('%');
    if (currentInput === 'Error') return;

    if (previousInput && operation) {
      // In expression context: e.g. 200 + 10% => 10% of 200 = 20
      const base = parseFloat(previousInput);
      const val = parseFloat(currentInput);
      if (!isNaN(base) && !isNaN(val)) {
        const percentVal = (base * val) / 100;
        setCurrentInput(percentVal.toString());
        return;
      }
    }

    // Standalone %: divide by 100
    const val = parseFloat(currentInput);
    if (!isNaN(val)) {
      const result = val / 100;
      setCurrentInput(result.toString());
    }
  }, [currentInput, operation, previousInput, triggerKeyHighlight]);

  // Scientific unary functions (sin, cos, tan, sqrt, etc.)
  const handleScientificFunc = useCallback(
    (func: string) => {
      soundController.playOperator();
      if (currentInput === 'Error') return;

      const outcome = executeScientificFunction(currentInput, func, angleMode);
      if (!outcome.success) {
        setCurrentInput('Error');
        return;
      }

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        previousInput: `${func}(${currentInput})`,
        operation: '=',
        currentInput: '',
        result: outcome.resultStr,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]);
      setCurrentInput(outcome.resultStr);
      setShouldResetScreen(true);
      setStatusText(`${func}() aplicado`);
    },
    [angleMode, currentInput]
  );

  // Constants (pi, e)
  const handleConstant = useCallback((constant: string) => {
    soundController.playDigit();
    const val = constant === 'pi' ? Math.PI.toString() : Math.E.toString();
    setCurrentInput(cleanPrecision(parseFloat(val), 10).toString());
    setShouldResetScreen(true);
  }, []);

  // History item selected
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    soundController.playDigit();
    setCurrentInput(item.result);
    setShouldResetScreen(true);
    setStatusText('Cargado de historial');
  }, []);

  // Clear history
  const handleClearHistory = useCallback(() => {
    soundController.playClear();
    setHistory([]);
    setStatusText('Historial vaciado');
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent calculation shortcuts if user is typing in a modal or input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('+');
      } else if (e.key === '-') {
        handleOperation('-');
      } else if (e.key === '*') {
        handleOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === '%') {
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleDecimal,
    handleOperation,
    handleCalculate,
    handleBackspace,
    handleClear,
    handlePercent,
  ]);

  // Sub-display preview text
  const subDisplayText =
    operation && previousInput
      ? `${formatDisplayNumber(previousInput)} ${operation}`
      : '';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex items-center justify-center p-4 md:p-8 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Desktop Window Layout */}
      <main className="w-full max-w-4xl bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col md:flex-row shadow-black/70 transition-all duration-300">
        {/* LEFT: Main Calculator Interface */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/60">
          {/* Top Bar: Window dots, title, audio and unit switchers */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
              <span className="ml-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                {calcMode === 'standard' ? 'Calculadora Estándar' : 'Calculadora Científica'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/40 text-xs">
              {/* Audio toggle button */}
              <button
                type="button"
                id="toggle-sound"
                onClick={toggleAudio}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  audioEnabled
                    ? 'text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                title={audioEnabled ? 'Silenciar sonidos de teclas' : 'Activar sonido de teclas'}
              >
                {audioEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="hidden sm:inline">Audio</span>
              </button>

              <span className="w-px h-3 bg-slate-700" />

              {/* DEG / RAD button */}
              <button
                type="button"
                id="btn-deg-rad"
                onClick={toggleAngleMode}
                className="px-2 py-1 rounded-lg font-mono font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={`Cambiar unidad angular (actual: ${angleMode})`}
              >
                {angleMode}
              </button>

              <span className="w-px h-3 bg-slate-700" />

              {/* Scientific Toggle */}
              <button
                type="button"
                onClick={toggleCalcMode}
                className={`px-2 py-1 rounded-lg font-mono font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  calcMode === 'scientific'
                    ? 'text-indigo-300 bg-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={
                  calcMode === 'scientific'
                    ? 'Cambiar a modo Estándar'
                    : 'Expandir funciones científicas (sin, cos, tan, log...)'
                }
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-[11px] font-sans font-medium">
                  {calcMode === 'scientific' ? 'Científica' : 'Más'}
                </span>
              </button>
            </div>
          </div>

          {/* Display Screen */}
          <Display currentInput={currentInput} subDisplay={subDisplayText} />

          {/* Keypad Grid */}
          <Keypad
            onNumber={handleNumber}
            onOperation={handleOperation}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onDecimal={handleDecimal}
            onNegate={handleNegate}
            onPercent={handlePercent}
            onCalculate={handleCalculate}
            activeKey={activeKey}
            activeOp={operation}
          />

          {/* Optional Scientific extension */}
          {calcMode === 'scientific' && (
            <div className="mt-3">
              <ScientificKeypad
                onScientificFunc={handleScientificFunc}
                onConstant={handleConstant}
                angleMode={angleMode}
              />
            </div>
          )}

          {/* Quick keyboard helper bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 flex-wrap">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                Teclado
              </kbd>
              <span>soportado: [0–9], [Enter], [Esc], [+, -, *, /]</span>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-indigo-400/80 hover:text-indigo-300 ml-1 inline-flex items-center gap-0.5 cursor-pointer"
                title="Ver todos los atajos"
              >
                <HelpCircle className="w-3 h-3 inline" />
              </button>
            </span>
            <span id="calc-status" className="text-indigo-400/80 font-mono text-xs">
              {statusText}
            </span>
          </div>
        </div>

        {/* RIGHT: History Panel & Memory */}
        <HistoryPanel
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          precisionMode={precisionMode}
          onTogglePrecision={() => {
            setPrecisionMode((prev) => !prev);
            soundController.playOperator();
            setStatusText(precisionMode ? 'Precisión desactivada' : 'Precisión activada');
          }}
        />
      </main>

      {/* Keyboard Shortcuts Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-semibold text-white mb-3">Atajos de Teclado</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Números</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  0 - 9
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Operaciones</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  + , - , * , /
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Calcular resultado</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  Enter o =
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Borrar todo (AC)</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  Escape o C
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Borrar último dígito</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  Backspace
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Punto decimal</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  . o ,
                </kbd>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Porcentaje</span>
                <kbd className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                  %
                </kbd>
              </div>
            </div>
            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
