import { method, multi, Multi } from '@arrows/multimethod'
import { is } from './is'
import { Base } from './Expression'
import { Real } from './real'
import { Complex } from './complex'
import { Variable } from './variable'
import { Unary } from './unary'
import { Addition } from './addition'
import { Multiplication } from './multiplication'
import { Exponentiation } from './exponentiation'
import { Logarithm } from './logarithmic'

export type DegreeFn = Multi 
  & ((expression: Real) => number)
  & ((expression: Complex) => number)
  & ((expression: Variable) => number)
  & ((expression: Multiplication) => number)
  & ((expression: Exponentiation) => number)
  & ((expression: Unary) => number)
  & ((expression: Base) => number)

export type SubDegreeFn = Multi
  & ((expression: Real) => number)
  & ((expression: Complex) => number)
  & ((expression: Variable) => number)
  & ((expression: Base) => number)

const subDegree: SubDegreeFn = multi(
  method(is(Real), (r: Real) => r.value),
  method(is(Complex), (c: Complex) => Math.hypot(c.a, c.b)),
  method(is(Variable), Infinity),
  method(is(Base), 0)
)

export const degree: DegreeFn = multi(
  method(is(Real), 0),
  method(is(Complex), 0),
  method(is(Variable), 1),
  method(is(Addition), (e: Addition) => Math.max(degree(e.left), degree(e.right))),
  method(is(Multiplication), (e: Multiplication) => degree(e.left) + degree(e.right)),
  method(is(Exponentiation), (e: Exponentiation) => subDegree(e.right)),
  method(is(Logarithm), 0),
  method(is(Unary), 1),
  method(is(Base), 0)
)
