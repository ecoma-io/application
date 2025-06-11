import { deepClone, deepMerge, entries, fromEntries, get, isObject, keys, set, unset, values, zipObject } from './object-utils';

describe('Object Utils', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone Date objects', () => {
      const date = new Date(2020, 0, 1);
      const cloned = deepClone(date);
      expect(cloned).toBeInstanceOf(Date);
      expect(cloned.getTime()).toBe(date.getTime());
      expect(cloned).not.toBe(date);
    });

    it('should clone arrays', () => {
      const array = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(array);
      expect(cloned).toEqual(array);
      expect(cloned).not.toBe(array);
      expect(cloned[1]).not.toBe(array[1]);
      expect(cloned[2]).not.toBe(array[2]);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.d).not.toBe(obj.d);
    });
  });

  describe('deepMerge', () => {
    type MergeType = { a: number; b: { c?: number; d?: number } } & {
      e?: number;
    };
    it('should merge two objects', () => {
      const target: MergeType = { a: 1, b: { c: 2 } };
      const source: Partial<MergeType> = { b: { d: 3 }, e: 4 };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it('should handle null and undefined values', () => {
      const target: { a: number; b: null | { c?: number } } = { a: 1, b: null };
      const source: Partial<typeof target> = { b: { c: 2 } };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });

    it('should not modify the original objects', () => {
      const target: MergeType = { a: 1, b: { c: 2 } };
      const source: Partial<MergeType> = { b: { d: 3 } };
      const result = deepMerge(target, source);
      expect(target).toEqual({ a: 1, b: { c: 2 } });
      expect(source).toEqual({ b: { d: 3 } });
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Date(2020, 0, 1))).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject([])).toBe(false);
    });
  });

  describe('get', () => {
    const obj = { a: { b: { c: 1 } }, d: [2, 3, { e: 4 }] };

    it('should get value by path', () => {
      expect(get(obj, 'a.b.c')).toBe(1);
      expect(get(obj, 'd[0]')).toBe(2);
      expect(get(obj, 'd[2].e')).toBe(4);
    });

    it('should return default value for non-existent path', () => {
      expect(get(obj, 'a.b.d', 'default')).toBe('default');
      expect(get(obj, 'x.y.z', null)).toBe(null);
    });

    it('should return undefined for non-existent path without default', () => {
      expect(get(obj, 'a.b.d')).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set value by path', () => {
      const obj: any = { a: { b: { c: 1 } } };
      set(obj, 'a.b.d', 2);
      expect(obj.a.b.d).toBeDefined();
      expect(obj.a.b.d).toBe(2);
    });

    it('should create nested objects if they do not exist', () => {
      const obj = {};
      set(obj, 'a.b.c', 1);
      expect(obj).toEqual({ a: { b: { c: 1 } } });
    });

    it('should handle array paths', () => {
      const obj = { a: [1, 2, 3] };
      set(obj, 'a[1]', 4);
      expect(obj.a[1]).toBe(4);
    });
  });

  describe('unset', () => {
    it('should remove value by path', () => {
      const obj = { a: { b: { c: 1 } } };
      unset(obj, 'a.b.c');
      expect(obj.a.b.c).toBeUndefined();
    });

    it('should return true if path exists', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(unset(obj, 'a.b.c')).toBe(true);
    });

    it('should return false if path does not exist', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(unset(obj, 'x.y.z')).toBe(false);
    });
  });

  describe('keys', () => {
    it('should get all keys with paths', () => {
      const obj = { a: { b: 1 }, c: [2, { d: 3 }] };
      const result = keys(obj);
      expect(result).toEqual(['a.b', 'c[0]', 'c[1].d']);
    });

    it('should handle empty objects', () => {
      expect(keys({})).toEqual([]);
    });
  });

  describe('values', () => {
    it('should get all values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(values(obj)).toEqual([1, 2, 3]);
    });

    it('should handle empty objects', () => {
      expect(values({})).toEqual([]);
    });
  });

  describe('entries', () => {
    it('should get all entries', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(entries(obj)).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('should handle empty objects', () => {
      expect(entries({})).toEqual([]);
    });
  });

  describe('fromEntries', () => {
    it('should create object from entries', () => {
      const entries: [string, unknown][] = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ];
      expect(fromEntries(entries)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle empty entries', () => {
      expect(fromEntries([])).toEqual({});
    });
  });

  describe('zipObject', () => {
    it('should create object from keys and values', () => {
      const keys = ['a', 'b', 'c'];
      const values = [1, 2, 3];
      expect(zipObject(keys, values)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle mismatched lengths', () => {
      const keys = ['a', 'b', 'c'];
      const values = [1, 2];
      expect(zipObject(keys, values)).toEqual({ a: 1, b: 2, c: undefined });
    });

    it('should handle empty arrays', () => {
      expect(zipObject([], [])).toEqual({});
    });
  });
});
