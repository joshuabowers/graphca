import { real } from "./real";
import { complex } from "./complex";
import { Unary, unary } from './unary';

export class AbsoluteValue extends Unary {
  readonly $kind = 'AbsoluteValue'
}

export const abs = unary(AbsoluteValue)(
  r => real(Math.abs(r.value)),
  c => complex(Math.hypot(c.a, c.b), 0)
)()
export type AbsFn = typeof abs
