import { bool } from './boolean'
import { real } from './real'
import { complex } from './complex'
import { fromMulti, method } from '@arrows/multimethod'
import { is } from './is'
import { Unary, unary } from './unary'

export class LogicalComplement extends Unary {
  readonly $kind = 'LogicalComplement'
}

const rawNot = unary(LogicalComplement)(
  r => real((r.value === 0) ? 1 : 0),
  c => complex((c.a === 0 && c.b === 0) ? 1 : 0, 0),
  b => bool(!b.value)
)

export type NotFn = typeof rawNot

export const not: NotFn = fromMulti(
  method(is(LogicalComplement), (e: LogicalComplement) => e.expression)
)(rawNot)
