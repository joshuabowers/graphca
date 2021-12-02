import { real } from "./real";
import { complex } from "./complex";
import { Unary, unary } from './unary';

export class AbsoluteValue extends Unary {
  readonly $kind = 'AbsoluteValue'
}

export const abs = unary(
  r => real(Math.abs(r.value)),
  c => complex(Math.hypot(c.a, c.b), 0),
  e => new AbsoluteValue(e)
)
export type AbsFn = typeof abs
