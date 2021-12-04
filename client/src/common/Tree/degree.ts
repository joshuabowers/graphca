import { method, multi, Multi } from '@arrows/multimethod'
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
  method(Real, (r: Real) => r.value),
  method(Complex, (c: Complex) => Math.hypot(c.a, c.b)),
  method(Variable, Infinity),
  method(Base, 0)
)

export const degree: DegreeFn = multi(
  method(Real, 0),
  method(Complex, 0),
  method(Variable, 1),
  method(Addition, (e: Addition) => Math.max(degree(e.left), degree(e.right))),
  method(Multiplication, (e: Multiplication) => degree(e.left) + degree(e.right)),
  method(Exponentiation, (e: Exponentiation) => subDegree(e.right)),
  method(Logarithm, 0),
  method(Unary, 1),
  method(Base, 0)
)