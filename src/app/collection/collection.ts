import { sortBy } from './sort-by';

export function shallowEqualArrays(a: any[], b: any[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!shallowEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

export function shallowEqual(a: { [x: string]: any }, b: { [x: string]: any }): boolean {
  // Casting Object.keys return values to include `undefined` as there are some cases
  // in IE 11 where this can happen. Cannot provide a test because the behavior only
  // exists in certain circumstances in IE 11, therefore doing this cast ensures the
  // logic is correct for when this edge case is hit.
  const k1 = Object.keys(a) as string[] | undefined;
  const k2 = Object.keys(b) as string[] | undefined;
  if (!k1 || !k2 || k1.length != k2.length) {
    return false;
  }
  let key: string;
  for (let i = 0; i < k1.length; i++) {
    key = k1[i];
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Flattens single-level nested arrays.
 */
export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}

/**
 * Return the last element of an array.
 */
export function last<T>(a: T[]): T | null {
  return a.length > 0 ? a[a.length - 1] : null;
}

/**
 * Verifys all booleans in an array are `true`.
 */
export function and(bools: boolean[]): boolean {
  return !bools.some(v => !v);
}

export function unique<T>(a: T[]): T[] {
  return [...new Set(a)];
}

export function forEach<V>(map: { [key: string]: V }, callback: (v: V, k: string) => void): void {
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      callback(map[prop], prop);
    }
  }
}

export function mapObject<V>(map: { [key: string]: V }, callback: (v: V, k: string) => any): { [key: string]: any } {
  const result: { [key: string]: any } = Object.create(map.constructor.prototype);
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      result[prop] = callback(map[prop], prop);
    }
  }
  return result;
}

export function mapValues<V, R>(map: { [key: string]: V }, callback: (v: V, k: string) => R): R[] {
  const result: R[] = new Array<R>();
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      result.push(callback(map[prop], prop));
    }
  }
  return result;
}

export function toMap<T, K>(items: T[], select: (item: T) => K): Map<K, T> {
  return new Map(items.map<[K, T]>(i => [select(i), i]));
}

export function keyBy<T>(items: T[], select: (item: T) => string): { [key: string]: T } {
  return items.reduce(function (groups, item) {
    const key = select(item);
    groups[key] = item;
    return groups;
  }, {} as { [key: string]: T });
}

export function groupBy<T>(items: T[], select: (item: T) => string, sort?: string): { [key: string]: T[] } {
  const groups = items.reduce(function (groups, item) {
    const key = select(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
  if (sort) {
    for (const values of Object.values(groups)) {
      values.sort(sortBy(sort));
    }
  }
  return groups;
}

export function groupByToMap<T, K>(items: T[], select: (item: T) => K, sort?: string): Map<K, T[]> {
  const groups = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    const key = select(item);
    if (!groups.has(key)) {
      groups.set(key, [item]);
    } else {
      groups.get(key).push(item);
    }
  }
  if (sort) {
    for (const values of groups.values()) {
      values.sort(sortBy(sort));
    }
  }
  return groups;
}

export function sumBy<T>(items: T[], select: (key: T) => number): number {
  return items.reduce((t, c) => t + select(c), 0);
}

export function sumAll<T extends object>(items: T[]): T | null {
  if (!items || !items.length) {
    return null;
  }
  return items.reduce(function (sumItem, item) {
    for (const prop in item) {
      if (item.hasOwnProperty(prop) && typeof (item as any)[prop] === 'number') {
        sumItem[prop] = (sumItem[prop] || 0) + item[prop];
      }
    }
    return sumItem;
  }, Object.create(items[0].constructor.prototype)) as T;
}

export function sumAllBy<T extends object>(items: T[], ...keys: string[]): T | null {
  if (!items || !items.length) {
    return null;
  }
  return items.reduce(function (sumItem, item) {
    for (const prop in item) {
      if (item.hasOwnProperty(prop) && typeof item[prop] === 'number' && keys.indexOf(prop) >= 0) {
        const curr = parseFloat(String(item[prop]));
        if (!isNaN(sumItem[prop]) || !isNaN(curr)) {
          sumItem[prop] = (sumItem[prop] || 0) + (curr || 0);
        } else {
          sumItem[prop] = NaN;
        }
      }
    }
    return sumItem;
  }, Object.create(items[0].constructor.prototype)) as T;
}
