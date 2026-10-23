import { AngleUnit, CalcOperation } from '../types/calculator';

/**
 * Format numeric strings with thousands separators while preserving trailing decimals and '-'
 */
export function formatDisplayNumber(val: string): string {
  if (!val) return '0';
  if (val === 'Error' || val === 'Infinity' || val === '-Infinity' || val === 'NaN') {
    return 'Error';
  }

  const isNegative = val.startsWith('-');
  const cleanVal = isNegative ? val.slice(1) : val;

  const parts = cleanVal.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  return (isNegative ? '-' : '') + integerPart + decimalPart;
}

/**
 * High-precision rounding to eliminate floating-point representation quirks
 * e.g., 0.1 + 0.2 => 0.3
 */
export function cleanPrecision(num: number, precision = 10): number {
  if (!isFinite(num) || isNaN(num)) return num;
  const factor = Math.pow(10, precision);
  const rounded = Math.round(num * factor) / factor;
  // Further trim precision if small epsilon
  const str = rounded.toFixed(precision);
  return parseFloat(str);
}

/**
 * Compute basic binary operations
 */
export function executeOperation(
  aStr: string,
  op: CalcOperation,
  bStr: string
): { success: boolean; resultStr: string } {
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);

  if (isNaN(a) || isNaN(b)) {
    return { success: false, resultStr: 'Error' };
  }

  let result = 0;

  switch (op) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      if (b === 0) {
        return { success: false, resultStr: 'Error' };
      }
      result = a / b;
      break;
    case '^':
      result = Math.pow(a, b);
      break;
    default:
      return { success: false, resultStr: bStr };
  }

  if (!isFinite(result) || isNaN(result)) {
    return { success: false, resultStr: 'Error' };
  }

  const cleaned = cleanPrecision(result, 11);
  return { success: true, resultStr: cleaned.toString() };
}

/**
 * Execute scientific unary functions
 */
export function executeScientificFunction(
  valStr: string,
  func: string,
  angleMode: AngleUnit = 'DEG'
): { success: boolean; resultStr: string } {
  const val = parseFloat(valStr);
  if (isNaN(val)) return { success: false, resultStr: 'Error' };

  let result = 0;
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  switch (func) {
    case 'sin': {
      const rad = angleMode === 'DEG' ? toRadians(val) : val;
      result = Math.sin(rad);
      break;
    }
    case 'cos': {
      const rad = angleMode === 'DEG' ? toRadians(val) : val;
      result = Math.cos(rad);
      break;
    }
    case 'tan': {
      const rad = angleMode === 'DEG' ? toRadians(val) : val;
      // check if undefined (e.g. 90 deg)
      if (angleMode === 'DEG' && Math.abs(val % 180) === 90) {
        return { success: false, resultStr: 'Error' };
      }
      result = Math.tan(rad);
      break;
    }
    case 'sqrt':
      if (val < 0) return { success: false, resultStr: 'Error' };
      result = Math.sqrt(val);
      break;
    case 'sqr':
      result = val * val;
      break;
    case 'cube':
      result = val * val * val;
      break;
    case 'inv':
      if (val === 0) return { success: false, resultStr: 'Error' };
      result = 1 / val;
      break;
    case 'ln':
      if (val <= 0) return { success: false, resultStr: 'Error' };
      result = Math.log(val);
      break;
    case 'log':
      if (val <= 0) return { success: false, resultStr: 'Error' };
      result = Math.log10(val);
      break;
    case 'exp':
      result = Math.exp(val);
      break;
    case 'fact': {
      if (val < 0 || !Number.isInteger(val) || val > 170) return { success: false, resultStr: 'Error' };
      let f = 1;
      for (let i = 2; i <= val; i++) f *= i;
      result = f;
      break;
    }
    default:
      return { success: true, resultStr: valStr };
  }

  if (!isFinite(result) || isNaN(result)) {
    return { success: false, resultStr: 'Error' };
  }

  const cleaned = cleanPrecision(result, 10);
  return { success: true, resultStr: cleaned.toString() };
}
