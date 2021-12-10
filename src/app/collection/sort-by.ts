/**
 * 排序方法生成器
 * 根据传入多个字段，和一个方法（可选），生成排序方法提供给Array.sort使用.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * users.sort(sortBy('name'));
 * ```
 *
 * sorts an array case-insensitively by applying a function
 * ```
 * users.sort(sortBy('name', function(key, value) {
 *    return key === 'name' ? value.toLowerCase() : value;
 * ));
 * ```
 *
 * Use `-` to reverse the sort order
 * ```
 * users.sort(sortBy('-name', '-age'));
 * ```
 *
 * Use `.` notation to traverse nested properties. See [object-path](https://www.npmjs.org/package/object-path) npm module for support.
 * ```
 * users.sort(sortBy('age', 'email.primary'));
 * ```
 *
 * Use `^` to ignore case
 * ```
 * users.sort(sortBy('name^'));
 * ```
 *
 *
 * @param properties
 */
export function sortBy<T>(...properties: Array<string | ((key: string, value: any) => any)>): (a: T, b: T) => number {
  return (obj1: T, obj2: T): number => {
    const props = properties.filter(prop => typeof prop === 'string') as string[];
    const map = properties.filter(prop => typeof prop === 'function')[0] as Function;
    let i = 0;
    let result = 0;

    const numberOfProperties = props.length;

    while (result === 0 && i < numberOfProperties) {
      result = sort<T>(props[i], map)(obj1, obj2);
      i++;
    }

    return result;
  };
}

function sort<T>(property: string, map?: Function): (a: T, b: T) => number {
  let sortOrder = 1;

  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  if (property[property.length - 1] === '^') {
    property = property.substr(0, property.length - 1);

    map = (_key: string, value: any): any => {
      const _value = typeof value === 'string' ? value.toLowerCase() : value;
      return (map && map(_key, _value)) || _value;
    };
  }
  const apply = map || ((_key: string, value: any): any => value);

  return (a: T, b: T): number => {
    let result = 0;

    const mappedA = apply(property, objectPath(a, property));
    const mappedB = apply(property, objectPath(b, property));

    if (mappedA < mappedB) {
      result = -1;
    } else if (mappedA > mappedB) {
      result = 1;
    }

    return result * sortOrder;
  };
}

function objectPath<T>(object: T, path: string): any {
  const pathParts = path.split('.');
  let result: any = object;
  for (const part of pathParts) {
    if (result.hasOwnProperty(part)) {
      result = result[part];
    } else {
      break;
    }
  }

  return result;
}
