import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines className strings with Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type-safe debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Type-safe throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Helper to enforce type-safety with exhaustive switch statements
 */
export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

/**
 * Type-safe object key access
 */
export function getObjectKey<T extends object>(
  obj: T,
  key: keyof T
): T[keyof T] | undefined {
  return obj[key];
}

/**
 * Safe JSON parse with type checking
 */
export function safeJSONParse<T>(
  text: string,
  reviver?: (key: any, value: any) => any
): T | null {
  try {
    return JSON.parse(text, reviver) as T;
  } catch {
    return null;
  }
}

/**
 * Ensure array type safety
 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Type-safe record access
 */
export function getRecordValue<K extends PropertyKey, T>(
  record: Partial<Record<K, T>>,
  key: K
): T | undefined {
  return record[key];
}

/**
 * Type-safe deep partial
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Type-safe deep merge
 */
export function deepMerge<T extends object>(
  target: T,
  ...sources: DeepPartial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) return target;

  if (isMergeableObject(target) && isMergeableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isMergeableObject(source[key as keyof typeof source])) {
        if (!target[key as keyof typeof target]) {
          target[key as keyof typeof target] = {} as T[keyof T];
        }
        deepMerge(
          target[key as keyof typeof target] as object,
          source[key as keyof typeof source] as object
        );
      } else {
        target[key as keyof typeof target] = source[
          key as keyof typeof source
        ] as T[keyof T];
      }
    });
  }

  return deepMerge(target, ...sources);
}

function isMergeableObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}
