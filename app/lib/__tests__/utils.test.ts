import {
  cn,
  debounce,
  throttle,
  formatBytes,
  assertNever,
  getObjectKey,
  safeJSONParse,
  ensureArray,
  getRecordValue,
  deepMerge
} from '../utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', null, undefined, 'class2')).toBe('class1 class2');
      expect(cn({ 'class1': true, 'class2': false })).toBe('class1');
    });

    it('handles Tailwind classes correctly', () => {
      expect(cn('px-4', 'py-2', 'hover:bg-blue-500')).toBe('px-4 py-2 hover:bg-blue-500');
      expect(cn('sm:px-6', { 'md:px-8': true, 'lg:px-0': false })).toBe('sm:px-6 md:px-8');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const isPrimary = false;

      expect(cn(
        'base-class',
        isActive && 'active',
        isPrimary && 'primary'
      )).toBe('base-class active');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debounces function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Multiple calls
      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('preserves arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test', 123);

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });

    it('preserves this context', () => {
      const obj = {
        value: 'test',
        method: debounce(function(this: any) {
          expect(this.value).toBe('test');
        }, 100)
      };

      obj.method();
      jest.advanceTimersByTime(100);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('throttles function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // Multiple calls
      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      // Fast forward time
      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('preserves last call', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('third');
    });
  });

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('handles decimal places', () => {
      expect(formatBytes(1500, 2)).toBe('1.46 KB');
      expect(formatBytes(1500, 1)).toBe('1.5 KB');
      expect(formatBytes(1500, 0)).toBe('1 KB');
    });

    it('handles negative decimals', () => {
      expect(formatBytes(1500, -1)).toBe('1 KB');
    });

    it('handles large numbers', () => {
      const TB = 1024 * 1024 * 1024 * 1024;
      expect(formatBytes(TB)).toBe('1 TB');
    });
  });

  describe('assertNever', () => {
    it('throws error for unexpected values', () => {
      expect(() => assertNever('unexpected' as never)).toThrow();
    });
  });

  describe('getObjectKey', () => {
    it('retrieves object keys safely', () => {
      const obj = { a: 1, b: 2 };
      expect(getObjectKey(obj, 'a')).toBe(1);
      expect(getObjectKey(obj, 'c')).toBeUndefined();
    });
  });

  describe('safeJSONParse', () => {
    it('parses valid JSON', () => {
      expect(safeJSONParse<{ test: number }>('{"test": 123}')).toEqual({ test: 123 });
    });

    it('returns null for invalid JSON', () => {
      expect(safeJSONParse('{invalid json}')).toBeNull();
    });

    it('handles reviver function', () => {
      const reviver = (key: string, value: any) => {
        if (key === 'date') return new Date(value);
        return value;
      };

      const result = safeJSONParse('{"date":"2023-01-01"}', reviver);
      expect(result?.date instanceof Date).toBe(true);
    });
  });

  describe('ensureArray', () => {
    it('wraps non-array values', () => {
      expect(ensureArray('test')).toEqual(['test']);
      expect(ensureArray(123)).toEqual([123]);
    });

    it('preserves arrays', () => {
      expect(ensureArray(['test'])).toEqual(['test']);
      expect(ensureArray([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('getRecordValue', () => {
    it('retrieves record values safely', () => {
      const record: Partial<Record<string, number>> = { a: 1, b: 2 };
      expect(getRecordValue(record, 'a')).toBe(1);
      expect(getRecordValue(record, 'c')).toBeUndefined();
    });
  });

  describe('deepMerge', () => {
    it('merges objects deeply', () => {
      const obj1 = { a: { b: 1 }, c: 3 };
      const obj2 = { a: { d: 2 }, e: 4 };
      const expected = { a: { b: 1, d: 2 }, c: 3, e: 4 };

      expect(deepMerge(obj1, obj2)).toEqual(expected);
    });

    it('handles arrays', () => {
      const obj1 = { a: [1, 2] };
      const obj2 = { a: [3, 4] };

      expect(deepMerge(obj1, obj2)).toEqual({ a: [3, 4] });
    });

    it('handles multiple sources', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };

      expect(deepMerge(obj1, obj2, obj3)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('handles undefined sources', () => {
      const obj = { a: 1 };
      expect(deepMerge(obj, undefined)).toEqual(obj);
    });

    it('handles null values', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: null };

      expect(deepMerge(obj1, obj2)).toEqual({ a: null });
    });
  });
});
