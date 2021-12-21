function defaultCompareFunction<T>(first: T, second: T): number {
  if (first < second) {
    return -1;
  } else if (first == second) {
    return 0;
  } /* if (firstAsString > secondAsString) */ else {
    return 1;
  }
}

export function mapSort<T>(mapCallback: (value: T) => any, compareFn?: (a: T, b: T) => number): (a: T, b: T) => number {
  if ('function' != typeof mapCallback) {
    throw new TypeError(mapCallback + ' is not a function');
  }
  return (a: T, b: T): number => {
    const mappedA = mapCallback(a);
    const mappedB = mapCallback(b);

    compareFn = compareFn || defaultCompareFunction;
    return compareFn(mappedA, mappedB);
  };
}
