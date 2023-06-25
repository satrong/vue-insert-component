
export function omit<T extends Record<string, any>, K extends (keyof T)[]>(obj: T, keys: K) {
  const result = {} as T
  for (const key in obj) {
    if (!keys.includes(key as K[number])) {
      result[key] = obj[key]
    }
  }
  return result as Omit<T, K[number]>
}
