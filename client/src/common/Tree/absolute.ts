import { method, multi, Multi } from '@arrows/multimethod'
import { Base, Real, Complex, AbsoluteValue } from "./Expression";
import { real } from "./real";
import { complex } from "./complex";
import { unary } from './unary';

export const abs = unary(
  r => real(Math.abs(r.value)),
  c => complex(Math.hypot(c.a, c.b), 0),
  e => new AbsoluteValue(e)
)
export type AbsFn = typeof abs
