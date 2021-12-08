export type Constructor<T> = Function & { prototype: T }

// type can occasionally be undefined, so the guard needs to account for that.
export const is = <T>(type: Constructor<T>) => 
  (v: unknown): v is T => type && v instanceof type
