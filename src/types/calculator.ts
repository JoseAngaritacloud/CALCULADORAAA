export interface HistoryItem {
  id: string;
  previousInput: string;
  operation: string;
  currentInput: string;
  result: string;
  timestamp: number;
}

export type CalcOperation = '+' | '-' | '×' | '÷' | '^' | null;

export type AngleUnit = 'DEG' | 'RAD';

export type CalculatorMode = 'standard' | 'scientific';
