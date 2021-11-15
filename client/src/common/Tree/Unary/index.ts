export { Unary, unary } from './Unary'
export { Negation, negate } from './Negation'
export { BinaryLogarithm, lb } from './BinaryLogarithm'
export { NaturalLogarithm, ln } from './NaturalLogarithm'
export { CommonLogarithm, lg } from './CommonLogarithm'

import { BinaryLogarithm } from './BinaryLogarithm'
import { CommonLogarithm } from './CommonLogarithm'
import { NaturalLogarithm } from './NaturalLogarithm'
export type Logarithm = BinaryLogarithm | NaturalLogarithm | CommonLogarithm
