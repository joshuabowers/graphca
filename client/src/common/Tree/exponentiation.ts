import { method, multi, Multi, _ } from '@arrows/multimethod';
import { Kind, Base, Real, Exponentiation } from './Expression';
import { partialRight } from './partial';
// import { match } from 'ts-pattern';
import { real } from './real';

const raiseReals = (left: Real, right: Real) => real(left.value ** right.value)
const raiseBase = (left: Base, right: Base) => new Exponentiation(left, right)

export type Raise = Multi
  & typeof raiseReals
  & typeof raiseBase

export const raise: Raise = multi(
  method([Real, Real], raiseReals),
  method([Base, Base], raiseBase)
)

export const reciprocal = partialRight(raise, real(-1))
export const square = partialRight(raise, real(2))
export const sqrt = partialRight(raise, real(0.5))
