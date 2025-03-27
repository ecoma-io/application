import {
  chunk,
  unique,
  uniqueBy,
  intersection,
  intersectionBy,
  difference,
  differenceBy,
  first,
  last,
  random,
  randomItems,
  includesAll,
  includesAny,
  range,
} from './array-utils';

describe('Array Utils', () => {
  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(chunk(array, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
    });

    it('should return empty array for empty input', () => {
      expect(chunk([], 3)).toEqual([]);
    });
  });

  describe('unique', () => {
    it('should return array with unique values', () => {
      const array = [1, 2, 2, 3, 3, 3, 4];
      expect(unique(array)).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('uniqueBy', () => {
    it('should return array with unique values based on key', () => {
      const array = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      expect(uniqueBy(array, 'id')).toEqual([
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ]);
    });
  });

  describe('intersection', () => {
    it('should return common elements between two arrays', () => {
      const array1 = [1, 2, 3, 4];
      const array2 = [3, 4, 5, 6];
      expect(intersection(array1, array2)).toEqual([3, 4]);
    });
  });

  describe('intersectionBy', () => {
    it('should return common elements based on key', () => {
      const array1 = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      const array2 = [
        { id: 2, name: 'c' },
        { id: 3, name: 'd' },
      ];
      expect(intersectionBy(array1, array2, 'id')).toEqual([
        { id: 2, name: 'b' },
      ]);
    });
  });

  describe('difference', () => {
    it('should return elements in first array not in second array', () => {
      const array1 = [1, 2, 3, 4];
      const array2 = [3, 4, 5, 6];
      expect(difference(array1, array2)).toEqual([1, 2]);
    });
  });

  describe('differenceBy', () => {
    it('should return elements in first array not in second array based on key', () => {
      const array1 = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      const array2 = [
        { id: 2, name: 'c' },
        { id: 3, name: 'd' },
      ];
      expect(differenceBy(array1, array2, 'id')).toEqual([
        { id: 1, name: 'a' },
      ]);
    });
  });

  describe('first', () => {
    it('should return first element of array', () => {
      expect(first([1, 2, 3])).toBe(1);
    });

    it('should return undefined for empty array', () => {
      expect(first([])).toBeUndefined();
    });
  });

  describe('last', () => {
    it('should return last element of array', () => {
      expect(last([1, 2, 3])).toBe(3);
    });

    it('should return undefined for empty array', () => {
      expect(last([])).toBeUndefined();
    });
  });

  describe('random', () => {
    it('should return a random element from array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = random(array);
      expect(array).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(random([])).toBeUndefined();
    });
  });

  describe('randomItems', () => {
    it('should return specified number of random items', () => {
      const array = [1, 2, 3, 4, 5];
      const result = randomItems(array, 3);
      expect(result.length).toBe(3);
      result.forEach(item => {
        expect(array).toContain(item);
      });
    });

    it('should return all items if count is greater than array length', () => {
      const array = [1, 2, 3];
      const result = randomItems(array, 5);
      expect(result.length).toBe(3);
    });
  });

  describe('includesAll', () => {
    it('should return true if array contains all items', () => {
      const array = [1, 2, 3, 4, 5];
      expect(includesAll(array, [1, 3, 5])).toBe(true);
    });

    it('should return false if array does not contain all items', () => {
      const array = [1, 2, 3, 4, 5];
      expect(includesAll(array, [1, 3, 6])).toBe(false);
    });
  });

  describe('includesAny', () => {
    it('should return true if array contains any of the items', () => {
      const array = [1, 2, 3, 4, 5];
      expect(includesAny(array, [6, 3, 7])).toBe(true);
    });

    it('should return false if array does not contain any of the items', () => {
      const array = [1, 2, 3, 4, 5];
      expect(includesAny(array, [6, 7, 8])).toBe(false);
    });
  });

  describe('range', () => {
    it('should create array with numbers from start to end', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('should handle step parameter', () => {
      expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    });

    it('should return empty array if start equals end', () => {
      expect(range(1, 1)).toEqual([]);
    });
  });
});
