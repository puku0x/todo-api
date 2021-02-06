export function sortObjectByKeys<T>(obj: T): T {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        return {
          ...result,
          [key]: obj[key],
        };
      }, {} as T);
  }