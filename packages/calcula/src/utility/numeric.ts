import { Multi, multi, method } from '@arrows/multimethod'
import { Unicode } from '../Unicode'

export type NumericFn = Multi & ((value: number) => string)

export const numeric: NumericFn = multi(
  method(Math.E, Unicode.e),
  method(Math.PI, Unicode.pi),
  method(Infinity, Unicode.infinity),
  method(-Infinity, `-${Unicode.infinity}`),
  method((value: number) => value.toString())
)
