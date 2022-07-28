import { bool, Boolean } from './boolean'
import { real } from './real'
import { complex } from './complex'
import { fromMulti, method } from '@arrows/multimethod'
import { is } from './is'
import { Unary, unary } from './unary'

export class LogicalComplement extends Unary {
  readonly $kind = 'LogicalComplement'
}

const rawNot = unary(LogicalComplement, Boolean)(
  r => bool(r.value === 0),
  c => bool(c.a === 0 && c.b === 0),
  b => bool(!b.value)
)

export type NotFn = typeof rawNot

export const not: NotFn = fromMulti(
  method(is(LogicalComplement), (e: LogicalComplement) => e.expression)
)(rawNot)
