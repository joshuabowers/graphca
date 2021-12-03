import { method, fromMulti } from '@arrows/multimethod'
import { Base } from './Expression'
import { real } from './real'
import { Complex, complex } from './complex'
import { Binary, binary, unaryFrom, bindLeft } from './binary'
import { divide } from './multiplication'
import { Exponentiation } from './exponentiation'
import { equals } from './equality'

export class Logarithm extends Binary {
  readonly $kind = 'Logarithm'
}

const lnComplex = (c: Complex) => complex(
  Math.log(Math.hypot(c.a, c.b)),
  Math.atan2(c.b, c.a)
)

const isMatchingBases = (left: Base, right: Base) =>
  right instanceof Exponentiation && equals(left, right.left)

const rawLog = binary(Logarithm)(
  (l, r) => real(Math.log(r.value) / Math.log(l.value)),
  (l, r) => {
    const n = lnComplex(r)
    if(l.a === Math.E && l.b === 0){ return n }
    return divide(lnComplex(r), lnComplex(l))
  }
)
export type LogFn = typeof rawLog

export const log: LogFn = fromMulti(
  method(isMatchingBases, (_l: Base, r: Exponentiation) => r.right)
)(rawLog)

const fromLog = unaryFrom(log, bindLeft)
export const lb = fromLog(real(2))
export const ln = fromLog(real(Math.E))
export const lg = fromLog(real(10))
