export const isNumber = (v: unknown): v is number => typeof v === 'number'

export const isNumberTuple = (v: unknown): v is [number, number] =>
  Array.isArray(v) && v.length === 2 && isNumber(v[0]) && isNumber(v[1])

export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'
