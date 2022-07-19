import { bool } from './boolean'
import { real } from './real'
import { complex } from './complex'
import { Unary, unary } from './unary'

export class LogicalComplement extends Unary {
  readonly $kind = 'LogicalComplement'
}

export const not = unary(LogicalComplement)(
  r => real((r.value === 0) ? 1 : 0),
  c => complex((c.a === 0 && c.b === 0) ? 1 : 0, 0),
  b => bool(!b.value)
)
